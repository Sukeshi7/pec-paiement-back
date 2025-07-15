const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize').sequelize;
const Merchant = require('./Merchant');

const Transaction = sequelize.define('Transaction', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
  paymentUrl: {
    type: DataTypes.STRING,
  },
  redirectSuccessUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  redirectCancelUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Transaction.belongsTo(Merchant, {
  foreignKey: 'merchantId',
  onDelete: 'CASCADE',
});

module.exports = Transaction;
