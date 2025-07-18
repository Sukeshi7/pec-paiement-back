const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Operation = sequelize.define("Operation", {
  type: {
    type: DataTypes.ENUM('capture', 'refund'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'done',
  },
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "operations",
  timestamps: true,
});

module.exports = Operation;
