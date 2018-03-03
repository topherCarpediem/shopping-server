/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "last_name",
    },
    emailAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      field: "email_address",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cardId: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: "card_id",
    }
  })
};
