"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (sequelize, DataTypes) => {

  const Order = sequelize.define('order', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderStatus: {
      type: DataTypes.STRING,
      field: "order_status",
      allowNull: false
    },
    orderType: {
      field: "order_type",
      type: DataTypes.STRING,
      allowNull: false
    },

    orderShippingAddress: {
      field: "order_shipping_address",
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Order.associate = models => {
    Order.belongsTo(models.User);
    Order.belongsTo(models.Product);
  };

  return Order;
};