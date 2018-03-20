export default (sequelize, DataTypes) => {
  
    const Order =  sequelize.define('order', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      orderStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      orderType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orderShippingAddress: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })
  
    return Order
  
    
  };
  