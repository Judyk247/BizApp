const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Business = require('./Business')(sequelize);
const Product = require('./Product')(sequelize);
const Supplier = require('./Supplier')(sequelize);
const Purchase = require('./Purchase')(sequelize);
const Customer = require('./Customer')(sequelize);
const Sale = require('./Sale')(sequelize);
const SaleItem = require('./SaleItem')(sequelize);
const CreditTransaction = require('./CreditTransaction')(sequelize);

// Associations
Purchase.belongsTo(Product, { foreignKey: 'productId' });
Purchase.belongsTo(Supplier, { foreignKey: 'supplierId' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });
SaleItem.belongsTo(Sale, { foreignKey: 'saleId' });
SaleItem.belongsTo(Product, { foreignKey: 'productId' });
CreditTransaction.belongsTo(Customer, { foreignKey: 'customerId' });
CreditTransaction.belongsTo(Sale, { foreignKey: 'saleId' });

// For scoping by business, all models will have businessId
// We'll add scope in queries manually

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
