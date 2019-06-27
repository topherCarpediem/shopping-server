export default (sequelize, DataTypes) => {
  
    const StockTrail =  sequelize.define('stockTrail', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      currentStock: {
        type: DataTypes.INTEGER,
        field: "current_stock",
        allowNull: false
      },
      in: {
        type: DataTypes.INTEGER,
      },
      out : {
        type: DataTypes.INTEGER,
      }
    })
    
    StockTrail.associate = (models) => {
      StockTrail.belongsTo(models.Product)
    }

    return StockTrail    
  };
  