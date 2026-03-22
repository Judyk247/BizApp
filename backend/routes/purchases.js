const express = require('express');
const { createPurchase, getPurchaseById } = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, authorize('admin', 'manager'), createPurchase);
router.get('/:id', authenticate, getPurchaseById);

module.exports = router;
