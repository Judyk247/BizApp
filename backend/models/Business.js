module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    business_name: DataTypes.STRING,
    email: DataTypes.STRING,
    contact_address: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    rc_number: DataTypes.STRING,
    description_of_goods_services: DataTypes.TEXT,
    logo_url: DataTypes.STRING,
    invite_code: { type: DataTypes.STRING, unique: true }
  });
  return Business;
};
