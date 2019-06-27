'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* jshint indent: 2 */

exports.default = (sequelize, DataTypes) => {

  const ProductFeature = sequelize.define('productFeature', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    featureName: {
      type: DataTypes.STRING,
      field: 'feature_name'
    },
    featureDescription: {
      type: DataTypes.STRING,
      field: 'feature_description'
    }
  });

  ProductFeature.associate = models => {
    ProductFeature.belongsTo(models.Product);
  };

  return ProductFeature;
};