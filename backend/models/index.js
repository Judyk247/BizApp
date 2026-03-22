const { DataTypes } = require('sequelize');        // <-- ADD THIS
const sequelize = require('../config/database');

// Pass DataTypes as second argument
const User = require('./User')(sequelize, DataTypes);
const Business = require('./Business')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const Supplier = require('./Supplier')(sequelize, DataTypes);
const Purchase = require('./Purchase')(sequelize, DataTypes);
const Customer = require('./Customer')(sequelize, DataTypes);
const Sale = require('./Sale')(sequelize, DataTypes);
const SaleItem = require('./SaleItem')(sequelize, DataTypes);
const CreditTransaction = require('./CreditTransaction')(sequelize, DataTypes);

// Associations
Purchase.belongsTo(Product, { foreignKey: 'productId' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });
SaleItem.belongsTo(Product, { foreignKey: 'productId' });
CreditTransaction.belongsTo(Customer, { foreignKey: 'customerId' });
CreditTransaction.belongsTo(Sale, { foreignKey: 'saleId' });

module.exports = {
  sequelize,
  User,
  Business,
  Product,
  Supplier,
  Purchase,
  Customer,
  Sale,
  SaleItem,
  CreditTransaction,
};
