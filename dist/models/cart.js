'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* jshint indent: 2 */

exports.default = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {
    cid: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  Cart.associate = models => {
    Cart.belongsTo(models.Product);
    Cart.belongsTo(models.User);
  };

  return Cart;
};