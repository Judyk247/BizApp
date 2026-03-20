module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.TEXT,
    credit_limit: DataTypes.DECIMAL(10,2),
    businessId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return Customer;
};
