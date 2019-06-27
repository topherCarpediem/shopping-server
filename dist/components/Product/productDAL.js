"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateStocks = undefined;

let addProduct = (() => {
    var _ref = _asyncToGenerator(function* (params) {
        const productDetails = {
            productName: params.productName,
            productPrice: params.productPrice,
            productOldPrice: params.productOldPrice,
            productDescription: params.productDescription,
            imageCover: params.imageCover,
            isActive: params.isActive
        };

        Product.create();
    });

    return function addProduct(_x) {
        return _ref.apply(this, arguments);
    };
})();

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Op } = _models2.default.Sequelize;

const { Product, StockTrail } = _models2.default;

function updateStocks(params) {
    const { productDetails, userId } = params;
    //console.log(productDetails)
    const productIds = productDetails.map(product => product.id);

    return Product.findAll({
        where: {
            id: {
                [Op.or]: productIds
            }
        }
    }).then(result => {
        if (result.length === 0) {
            throw new Error("ProductNotExistError");
        }
        const products = result.map(product => {
            return product.dataValues;
        });

        products.forEach(product => {
            productDetails.forEach(prod => {
                if (product.id === prod.id) {
                    if (product.stocks < prod.quantity) {
                        throw new Error("OrderGreaterThanStocksError");
                    }
                    if (product.user_id === userId) {
                        throw new Error("OwnItemError");
                    }
                }
            });
        });

        return products;
    }).then(products => {

        let setters = '';
        let condition = '';

        const temp = [];

        products.forEach(product => {
            productDetails.forEach(prod => {
                if (product.id === prod.id) {

                    setters += `WHEN '${product.id}' THEN ${product.stocks - prod.quantity} `;
                    condition += `'${product.id}',`;

                    temp.push({
                        currentStock: product.stocks,
                        out: prod.quantity,
                        product_id: product.id,
                        created_at: new Date(),
                        updated_at: new Date()
                    });
                }
            });
        });

        const rawQuery = `
        UPDATE products  
        SET stocks = CASE id 
        ${setters} 
        END 
        WHERE id IN (${condition.slice(0, -1)})`;

        return StockTrail.bulkCreate(temp).then(result => {
            //console.log(result)
            return _models2.default.sequelize.query(rawQuery);
        });
    });
}

exports.updateStocks = updateStocks;