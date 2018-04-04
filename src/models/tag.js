/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  
    const Tag =  sequelize.define('tag', {  
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      tagName : {
        type: DataTypes.STRING,
        field: 'tag_name'
      }
    })
  
    Tag.associate = (models) => {
        Tag.belongsTo(models.Product)
    }

    return Tag
  };
  