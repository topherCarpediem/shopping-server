/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  
  const Product =  sequelize.define('product', {  
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "product_name",
    },
    productPrice: {
      type: "DOUBLE",
      allowNull: false,
      field: "product_price",
    },
    productOldPrice: {
      type: "DOUBLE",
      allowNull: false,
      field: "product_old_price",
    },
    productDescription: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "product_description",
    },
   
    imageCover : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "image_cover",
    },
    isActive: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      field: "is_active",
    }
  })

  Product.associate = (models) => {
    Product.belongsTo(models.User)
    Product.belongsTo(models.Category)
  }


  

  return Product

  
};
