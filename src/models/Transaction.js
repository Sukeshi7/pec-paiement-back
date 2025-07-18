const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sequelize");

const Transaction = sequelize.define(
  "Transaction",
  {
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
      defaultValue: "pending",
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
    },
    callbackUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);


module.exports = Transaction;
