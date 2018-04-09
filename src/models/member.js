export default (sequelize, DataTypes) => {
  
    const Member =  sequelize.define('member', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      }
    })
    
    Member.associate = (models) => {
        Member.belongsTo(models.User)
        Member.belongsTo(models.Room)
    }

    return Member    
  };
  