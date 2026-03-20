module.exports = (sequelize, DataTypes) => {
  const SaleItem = sequelize.define('SaleItem', {
    quantity: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    selling_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    cost_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    profit: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    businessId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return SaleItem;
};
