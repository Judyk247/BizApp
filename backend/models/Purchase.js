module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    quantity: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    unit_cost: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_cost: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    purchase_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    expiry_date: DataTypes.DATEONLY,
    notes: DataTypes.TEXT,
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Purchase;
};
