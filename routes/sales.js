const express = require('express');
const { createSale, getSaleById, getSales } = require('../controllers/saleController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/', authenticate, createSale);
router.get('/', authenticate, getSales);
router.get('/:id', authenticate, getSaleById);

module.exports = router;
