const express = require('express');
const { getCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getCustomers);
router.post('/', authenticate, authorize('admin', 'manager'), createCustomer);
router.get('/:id', authenticate, getCustomerById);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateCustomer);
router.delete('/:id', authenticate, authorize('admin'), deleteCustomer);

module.exports = router;
