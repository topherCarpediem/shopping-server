/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
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

  Cart.associate = (models) => {
    Cart.hasMany(models.Product)
  }

  return Cart
};
