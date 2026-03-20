const { Sale, SaleItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');

const getDateRange = (period, startDate, endDate) => {
  if (startDate && endDate) {
    return { [Op.between]: [new Date(startDate), new Date(endDate)] };
  }
  const now = new Date();
  let start;
  switch (period) {
    case 'day':
      start = new Date(now.setHours(0,0,0,0));
      break;
    case 'week':
      const firstDay = now.getDate() - now.getDay();
      start = new Date(now.setDate(firstDay));
      start.setHours(0,0,0,0);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      start = new Date(0);
  }
  return { [Op.gte]: start };
};

exports.getSalesReport = async (req, res) => {
  try {
    const { period, startDate, endDate, cashierId } = req.query;
    const businessId = req.user.businessId;

    const whereSale = {
      businessId,
      ...(cashierId && { userId: cashierId }),
      ...(startDate || endDate || period ? { sale_date: getDateRange(period, startDate, endDate) } : {})
    };

    const sales = await Sale.findAll({
      where: whereSale,
      include: [{ model: SaleItem, attributes: ['profit', 'total'] }],
      attributes: ['total_amount', 'amount_paid', 'is_credit_sale']
    });

    const totalSales = sales.reduce((sum, s) => sum + parseFloat(s.total_amount), 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.SaleItems.reduce((p, i) => p + parseFloat(i.profit), 0), 0);
    const totalPaid = sales.reduce((sum, s) => sum + parseFloat(s.amount_paid), 0);
    const totalCredit = totalSales - totalPaid;

    res.json({
      totalSales,
      totalProfit,
      totalPaid,
      totalCredit,
      count: sales.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating sales report' });
  }
};

exports.getCashiers = async (req, res) => {
  try {
    const cashiers = await User.findAll({
      where: { businessId: req.user.businessId, role: ['cashier', 'manager'] },
      attributes: ['id', 'username', 'email']
    });
    res.json(cashiers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cashiers' });
  }
};

exports.getLowStock = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        businessId: req.user.businessId,
        [Op.and]: sequelize.where(sequelize.col('current_stock'), '<=', sequelize.col('reorder_level'))
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching low stock' });
  }
};

exports.getExpiringProducts = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    const products = await Product.findAll({
      where: {
        businessId: req.user.businessId,
        expiry_date: { [Op.between]: [today, thirtyDaysLater] },
        is_service: false
      }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expiring products' });
  }
};
