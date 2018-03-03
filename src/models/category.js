/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('category', {
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    header: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    parentCategory: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'category'
  });
};
