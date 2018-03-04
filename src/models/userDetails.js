/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  const UserDetails =  sequelize.define('user_details', {
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
    card_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return UserDetails

  

  
};
