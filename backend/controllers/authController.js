const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Business } = require('../models');

const generateInviteCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

exports.register = async (req, res) => {
  const { username, email, password, inviteCode, businessDetails } = req.body;
  try {
    let business;
    if (inviteCode) {
      business = await Business.findOne({ where: { invite_code: inviteCode } });
      if (!business) return res.status(400).json({ message: 'Invalid invite code' });
    } else {
      if (!businessDetails || !businessDetails.business_name) {
        return res.status(400).json({ message: 'Business details required' });
      }
      const newInviteCode = generateInviteCode();
      business = await Business.create({
        business_name: businessDetails.business_name,
        email: businessDetails.email,
        contact_address: businessDetails.contact_address,
        phone_number: businessDetails.phone_number,
        rc_number: businessDetails.rc_number,
        description_of_goods_services: businessDetails.description_of_goods_services,
        invite_code: newInviteCode
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = inviteCode ? 'cashier' : 'admin';
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role,
      businessId: business.id
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, businessId: user.businessId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      token,
      user: { id: user.id, username, email, role: user.role, businessId: user.businessId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role, businessId: user.businessId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user.id, username: user.username, email, role: user.role, businessId: user.businessId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};
