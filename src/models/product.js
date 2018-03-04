/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  
  const Product =  sequelize.define('product', {  
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
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
    }
  })

  Product.associate = (models) => {
    Product.belongsTo(models.User)
  }

  Product.associate = (models) => {
    Product.belongsTo(models.Category)
  }

  

  return Product

  
};
