const express = require('express');
const { getCustomerCredit, recordPayment } = require('../controllers/creditController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/customer/:customerId', authenticate, getCustomerCredit);
router.post('/payment', authenticate, recordPayment);

module.exports = router;
