"use strict";

var _http = require("http");

var _fs = require("fs");

var _app = require("./app");

var _app2 = _interopRequireDefault(_app);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const privateKey = (0, _fs.readFileSync)("ssl/private.key");
const certificate = (0, _fs.readFileSync)("ssl/certificate.crt");

const options = {
    key: privateKey,
    cert: certificate
};

const categories = [{ name: "Men's Clothing", icon: "male" }, { name: "Women's Clothing", icon: "female" }, { name: "Shoes and Footwear", icon: "foot" }, { name: "Laptops and Computers", icon: "computer" }, { name: "Mobile Phones and Tablets", icon: "mobile" }, { name: "Watches and Jewelries", icon: "watch" }, { name: "Cars and Automotives", icon: "car" }, { name: "Motorcycles and Motogears", icon: "motorcycle" }, { name: "Bags and Luggages", icon: "shopping-bag" }];

const category = categories.map(category => {
    return {
        name: category.name,
        icon: category.icon,
        created_at: new Date(),
        updated_at: new Date()
    };
});

_models2.default.sequelize.authenticate().then(() => {
    console.log("Connected to the database engine");
    _models2.default.sequelize.sync({}).then(context => {
        //const server = createServer(options, app);
        // models.Category.bulkCreate(category).then(result => {
        //    console.log(result)
        // })
        const server = (0, _http.createServer)(_app2.default);
        server.listen(3001, () => {
            console.log(`Listening on port ${server.address().port}`);
        });
    });
}).catch(err => {
    console.log(err);
});