const { Purchase, Product, Supplier } = require('../models');
const sequelize = require('../config/database');

exports.createPurchase = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productId, supplierId, quantity, unitCost, purchaseDate, expiryDate, notes } = req.body;
    const totalCost = quantity * unitCost;

    const purchase = await Purchase.create({
      productId,
      supplierId,
      quantity,
      unit_cost: unitCost,
      total_cost: totalCost,
      purchase_date: purchaseDate,
      expiry_date: expiryDate,
      notes,
      businessId: req.user.businessId,
      userId: req.user.id
    }, { transaction: t });

    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) throw new Error('Product not found');
    await product.update({ current_stock: product.current_stock + quantity }, { transaction: t });

    await t.commit();
    res.status(201).json(purchase);
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Purchase creation failed' });
  }
};

exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      where: { id: req.params.id, businessId: req.user.businessId },
      include: [Product, Supplier]
    });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchase' });
  }
};
