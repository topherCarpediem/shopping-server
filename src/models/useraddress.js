/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('useraddress', {
    address_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    address1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    postal_code: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email1: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email2: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    tableName: 'useraddress'
  });
};
