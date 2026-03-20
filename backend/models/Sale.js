module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define('Sale', {
    sale_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    amount_paid: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    is_credit_sale: { type: DataTypes.BOOLEAN, defaultValue: false },
    notes: DataTypes.TEXT,
    businessId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Sale;
};
