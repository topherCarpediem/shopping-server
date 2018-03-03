/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    product_price: {
      type: "DOUBLE",
      allowNull: false
    },
    product_old_price: {
      type: "DOUBLE",
      allowNull: false
    },
    short_description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    full_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    small_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    medium_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    large_image: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isActive: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'category',
        key: 'category_id'
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
    tableName: 'product'
  });
};
