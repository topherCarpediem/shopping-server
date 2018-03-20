export default (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: "last_name",
    },
    emailAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      field: "email_address",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  })

  return User;
};
