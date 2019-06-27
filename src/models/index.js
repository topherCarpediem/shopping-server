import Sequelize from "sequelize";

const sequelize = new Sequelize(
    "shopping",
    "root",
    "101230",
    {
        host: "127.0.0.1",
        dialect: "mysql",
        dialectOptions: {
            encrypt: true,
            decimalNumbers: true
        },
        define: {
            underscored: true 
        },
        operatorsAliases: false
    },
);

const models = {
    User: sequelize.import('./users'),
    Order: sequelize.import('./order'),
    StockTrail: sequelize.import('./stocksTrail'),
    Product: sequelize.import('./product'),
    ProductFeature: sequelize.import('./productFeature'),
    Tag: sequelize.import('./tag'),
    Category: sequelize.import('./category'),
    Cart: sequelize.import('./cart'),
    Feedback: sequelize.import('./feedback'),
    Address: sequelize.import('./address'),
    Room: sequelize.import('./room'),
    Member: sequelize.import('./member'),
    Conversation: sequelize.import('./conversation'),
}

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]){
        models[modelName].associate(models)
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;




