module.exports = (sequelize, DataTypes) => {
  const CreditTransaction = sequelize.define('CreditTransaction', {
    amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    payment_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    due_date: DataTypes.DATEONLY,
    status: { type: DataTypes.ENUM('pending', 'partial', 'paid'), defaultValue: 'pending' },
    transaction_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: DataTypes.TEXT,
    businessId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return CreditTransaction;
};
