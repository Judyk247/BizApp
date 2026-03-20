const { Product, Supplier, Purchase, Customer, Sale, SaleItem, CreditTransaction } = require('../models');
const { Op } = require('sequelize');

exports.uploadChanges = async (req, res) => {
  try {
    const { lastSync, changes } = req.body; // changes is an array of operations
    const businessId = req.user.businessId;

    for (const change of changes) {
      const { model, action, data } = change;
      let Model;
      switch (model) {
        case 'Product': Model = Product; break;
        case 'Supplier': Model = Supplier; break;
        case 'Purchase': Model = Purchase; break;
        case 'Customer': Model = Customer; break;
        case 'Sale': Model = Sale; break;
        case 'SaleItem': Model = SaleItem; break;
        case 'CreditTransaction': Model = CreditTransaction; break;
        default: continue;
      }

      if (action === 'create') {
        await Model.create({ ...data, businessId });
      } else if (action === 'update') {
        await Model.update(data, { where: { id: data.id, businessId } });
      }
    }

    const lastSyncDate = lastSync ? new Date(lastSync) : new Date(0);
    const serverChanges = {
      products: await Product.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId } }),
      suppliers: await Supplier.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId } }),
      purchases: await Purchase.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId } }),
      customers: await Customer.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId } }),
      sales: await Sale.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId }, include: [SaleItem] }),
      creditTransactions: await CreditTransaction.findAll({ where: { updatedAt: { [Op.gte]: lastSyncDate }, businessId } }),
    };

    res.json({ serverChanges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sync failed' });
  }
};
