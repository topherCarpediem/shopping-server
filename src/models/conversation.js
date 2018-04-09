export default (sequelize, DataTypes) => {
  
    const Conversation =  sequelize.define('conversation', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT
      }
    })
    
    Conversation.associate = (models) => {
        Conversation.belongsTo(models.User)
        Conversation.belongsTo(models.Room)
    }

    return Conversation    
  };
  