"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const sequelize = new _sequelize2.default("shopping", "root", "", {
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
});

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
    Conversation: sequelize.import('./conversation')
};

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = _sequelize2.default;

exports.default = models;