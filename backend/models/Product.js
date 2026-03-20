module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    category: DataTypes.STRING,
    unit: DataTypes.STRING,
    selling_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    cost_price: DataTypes.DECIMAL(10,2),
    current_stock: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    reorder_level: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    expiry_date: DataTypes.DATEONLY,
    is_service: { type: DataTypes.BOOLEAN, defaultValue: false },
    businessId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Product;
};
