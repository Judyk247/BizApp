const express = require('express');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, getProducts);
router.post('/', authenticate, authorize('admin', 'manager'), createProduct);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;
