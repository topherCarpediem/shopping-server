'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* jshint indent: 2 */

exports.default = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(255)
    },
    // description: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false
    // },
    // header: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true
    // },
    parentCategory: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  });

  return Category;
};