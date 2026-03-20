const { Product } = require('../models');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { businessId: req.user.businessId }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body, businessId: req.user.businessId };
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, businessId: req.user.businessId }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id, businessId: req.user.businessId }
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
