require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Business } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const businessRoutes = require('./routes/business');
const productRoutes = require('./routes/products');
const purchaseRoutes = require('./routes/purchases');
const saleRoutes = require('./routes/sales');
const customerRoutes = require('./routes/customers');
const creditRoutes = require('./routes/credit');
const reportRoutes = require('./routes/reports');
const syncRoutes = require('./routes/sync');

app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sync', syncRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  // Ensure at least one admin exists for each business? We'll just create default if none exists overall.
  const adminExists = await User.findOne({ where: { role: 'admin' } });
  if (!adminExists) {
    const bcrypt = require('bcryptjs');
    const business = await Business.create({
      business_name: 'Demo Shop',
      invite_code: 'DEMO123'
    });
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('admin123', 10),
      role: 'admin',
      businessId: business.id
    });
    console.log('Default admin created: admin@example.com / admin123');
  }

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
