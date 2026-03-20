const { Sale, SaleItem, Product, Customer, CreditTransaction } = require('../models');
const sequelize = require('../config/database');

exports.createSale = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { customerId, items, totalAmount, amountPaid, paymentMethod, notes } = req.body;

    // Validate stock
    for (let item of items) {
      const product = await Product.findOne({
        where: { id: item.productId, businessId: req.user.businessId },
        transaction: t
      });
      if (!product.is_service && product.current_stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
    }

    const sale = await Sale.create({
      customerId,
      total_amount: totalAmount,
      amount_paid: amountPaid,
      payment_method: paymentMethod,
      is_credit_sale: paymentMethod === 'credit',
      notes,
      businessId: req.user.businessId,
      userId: req.user.id
    }, { transaction: t });

    for (let item of items) {
      const product = await Product.findOne({
        where: { id: item.productId, businessId: req.user.businessId },
        transaction: t
      });
      const costPrice = product.cost_price || 0;
      const sellingPrice = item.sellingPrice || product.selling_price;
      const quantity = item.quantity;
      const total = quantity * sellingPrice;
      const profit = (sellingPrice - costPrice) * quantity;

      await SaleItem.create({
        saleId: sale.id,
        productId: product.id,
        quantity,
        selling_price: sellingPrice,
        cost_price: costPrice,
        total,
        profit,
        businessId: req.user.businessId
      }, { transaction: t });

      if (!product.is_service) {
        await product.update({ current_stock: product.current_stock - quantity }, { transaction: t });
      }
    }

    if (paymentMethod === 'credit') {
      const creditAmount = totalAmount - amountPaid;
      if (creditAmount > 0) {
        await CreditTransaction.create({
          customerId,
          saleId: sale.id,
          amount: creditAmount,
          payment_amount: amountPaid,
          due_date: new Date(Date.now() + 30*24*60*60*1000),
          status: creditAmount === totalAmount ? 'pending' : 'partial',
          businessId: req.user.businessId
        }, { transaction: t });
      }
    }

    await t.commit();
    res.status(201).json({ saleId: sale.id });
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Sale creation failed' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: { id: req.params.id, businessId: req.user.businessId },
      include: [
        { model: SaleItem, include: [Product] },
        { model: Customer }
      ]
    });
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sale' });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { businessId: req.user.businessId },
      include: [Customer]
    });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sales' });
  }
};
