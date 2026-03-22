module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'manager', 'cashier'), defaultValue: 'cashier' },
    businessId: { type: DataTypes.INTEGER, allowNull: false }
  });
  return User;
};
