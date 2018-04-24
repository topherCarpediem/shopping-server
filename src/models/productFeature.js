/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  
    const ProductFeature =  sequelize.define('productFeature', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      featureName : {
        type: DataTypes.STRING,
        field: 'feature_name'
      },
      featureValue : {
        type: DataTypes.STRING,
        field: 'feature_value'
      }
    })
  
    // ProductFeature.associate = (models) => {
    //     ProductFeature.belongsTo(models.Product)
    // }

    return ProductFeature
  };
  