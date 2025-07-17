require('dotenv').config();
require('./models/Admin');
const express = require('express');
const Merchant = require('./models/Merchant');
const Transaction = require('./models/Transaction');
const { connectPostgres, syncDb } = require('./db/sequelize');
const connectMongo = require('./db/mongo');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const merchantRoutes = require('./routes/merchants');
const transactionRoutes = require('./routes/transactions');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const adminDashboardRoutes = require('./routes/adminDashboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/admin', adminDashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/merchants', merchantRoutes);
app.use('/transactions', transactionRoutes);
app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.send('API Payment prête');
});

app.listen(PORT, async () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  await connectPostgres();
  await syncDb();
  await connectMongo();
});
