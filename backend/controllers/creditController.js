const { CreditTransaction, Customer } = require('../models');

exports.getCustomerCredit = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.customerId, businessId: req.user.businessId }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    const transactions = await CreditTransaction.findAll({
      where: { customerId: customer.id, businessId: req.user.businessId }
    });
    const outstanding = transactions.reduce((sum, t) => sum + (t.amount - t.payment_amount), 0);
    res.json({ customer, transactions, outstanding });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching credit info' });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { customerId, saleId, amount, notes } = req.body;
    const transaction = await CreditTransaction.findOne({
      where: { saleId, businessId: req.user.businessId }
    });
    if (!transaction) return res.status(404).json({ message: 'Credit transaction not found' });

    const newPayment = transaction.payment_amount + amount;
    const status = newPayment >= transaction.amount ? 'paid' : 'partial';
    await transaction.update({
      payment_amount: newPayment,
      status,
      notes: notes ? `${transaction.notes || ''} Payment: ${amount}` : transaction.notes
    });
    res.json({ message: 'Payment recorded', transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error recording payment' });
  }
};
