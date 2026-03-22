const express = require('express');
const { getSalesReport, getCashiers, getLowStock, getExpiringProducts } = require('../controllers/reportController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/sales', authenticate, getSalesReport);
router.get('/cashiers', authenticate, authorize('admin'), getCashiers);
router.get('/low-stock', authenticate, getLowStock);
router.get('/expiring', authenticate, getExpiringProducts);

module.exports = router;
