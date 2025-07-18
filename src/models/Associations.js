const Merchant = require('./Merchant');
const Transaction = require('./Transaction');
const Operation = require('./Operation');

Merchant.hasMany(Transaction, {
  foreignKey: 'merchantId',
  onDelete: 'CASCADE',
});

Transaction.belongsTo(Merchant, {
  foreignKey: 'merchantId',
});

Transaction.hasMany(Operation, { foreignKey: 'transactionId' });
Operation.belongsTo(Transaction, { foreignKey: 'transactionId' });

module.exports = { Merchant, Transaction, Operation };
