const { Customer } = require('../models');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      where: { businessId: req.user.businessId }
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customerData = { ...req.body, businessId: req.user.businessId };
    const customer = await Customer.create(customerData);
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error creating customer' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, businessId: req.user.businessId }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, businessId: req.user.businessId }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.update(req.body);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Error updating customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, businessId: req.user.businessId }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting customer' });
  }
};
