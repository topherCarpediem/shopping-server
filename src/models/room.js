export default (sequelize, DataTypes) => {
  
    const Room =  sequelize.define('room', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      }
    })
    
    return Room    
  };
  