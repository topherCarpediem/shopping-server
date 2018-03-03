/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cart', {
    cart_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'product',
        key: 'product_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    tableName: 'cart'
  });
};
