const { Business } = require('../models');

exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ where: { id: req.user.businessId } });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching business' });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ where: { id: req.user.businessId } });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    await business.update(req.body);
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Error updating business' });
  }
};

exports.regenerateInviteCode = async (req, res) => {
  try {
    const business = await Business.findOne({ where: { id: req.user.businessId } });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    const newCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    await business.update({ invite_code: newCode });
    res.json({ invite_code: newCode });
  } catch (err) {
    res.status(500).json({ message: 'Error regenerating invite code' });
  }
};
