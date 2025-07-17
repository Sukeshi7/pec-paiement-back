const Merchant = require('./Merchant');
const Transaction = require('./Transaction');

Merchant.hasMany(Transaction, {
  foreignKey: 'merchantId',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(Merchant, {
  foreignKey: 'merchantId',
});

module.exports = { Merchant, Transaction };
