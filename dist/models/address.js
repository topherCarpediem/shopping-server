'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* jshint indent: 2 */

exports.default = (sequelize, DataTypes) => {
  const Address = sequelize.define('address', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    line1: { type: DataTypes.STRING },
    line2: { type: DataTypes.STRING },
    barangay: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    province: { type: DataTypes.STRING },
    phoneNumber: { type: DataTypes.STRING }

  });

  return Address;
};