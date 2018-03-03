import Sequelize from "sequelize";

const sequelize = new Sequelize(
    "shopping",
    "root",
    "",
    {
        host: "127.0.0.1",
        dialect: "mysql",
        dialectOptions: {
            encrypt: true
        },
        define: {
            underscored: true
        },
        operatorsAliases: false
    },
);

const models = {
    User: sequelize.import('./users'),
    // UserAddress: sequelize.import('./useraddress'),
    // Product: sequelize.import('./product'),
    // Category: sequelize.import('./category'),
    // Cart: sequelize.import('./cart'),
}

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]){
        models[modelName].associate(models)
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;




