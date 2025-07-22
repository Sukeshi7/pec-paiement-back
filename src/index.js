require('dotenv').config();
require('./models/Admin');
const express = require('express');
require('./models/Associations');
const Merchant = require('./models/Merchant');
const Transaction = require('./models/Transaction');
const Operation = require('./models/Operation');


const { connectPostgres, syncDb } = require('./db/sequelize');
const connectMongo = require('./db/mongo');
const cors = require('cors');

const pspRoutes = require('./routes/psp');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const merchantRoutes = require('./routes/merchants');
const transactionRoutes = require('./routes/transactions');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const adminDashboardRoutes = require('./routes/adminDashboard');
const operationsRoutes = require('./routes/operations');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173' || 'https://pec-paiement-front-olive-develop.vercel.app',
  credentials: true
}));

// app.options('*', cors());

app.use(express.json());

app.use('/admin', adminDashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/merchants', merchantRoutes);
app.use('/transactions', transactionRoutes);
app.use('/payment', paymentRoutes);
app.use('/transactions', operationsRoutes);
app.use('/', pspRoutes);

app.get('/', (req, res) => {
  res.send('API Payment prête');
});

app.listen(PORT, async () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  await connectPostgres();
  await syncDb();
  await connectMongo();
});
