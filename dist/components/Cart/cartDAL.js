"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAll = exports.isProductExist = exports.isItemExistInCart = exports.removeItem = exports.updateItem = exports.addItem = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// ======================================================
//  * * * * * * * * Add item to Cart * * * * * * * *
// ======================================================
let addItem = (() => {
    var _ref = _asyncToGenerator(function* (params) {
        const isProduct = yield isProductExist({ product_id: params.product_id, userId: params.user_id });

        if (isProduct === 0) {
            throw new Error("ProductNotExistError");
        }

        const isExist = yield isItemExistInCart({ product_id: params.product_id, userId: params.user_id });
        if (isExist !== 0) {
            throw new Error("ItemExistInCartError");
        } else {

            const product = yield Product.find({
                where: {
                    id: params.product_id
                }
            });

            if (product.dataValues.user_id === params.user_id) {
                throw new Error("OwnItemError");
            }

            const createdItem = yield Cart.create(_extends({}, params));
            return createdItem;
        }
    });

    return function addItem(_x) {
        return _ref.apply(this, arguments);
    };
})();

// ======================================================
//  * * * * * * * * Update item in Cart * * * * * * * *
// ======================================================


let updateItem = (() => {
    var _ref2 = _asyncToGenerator(function* (params) {
        const { productId, quantity, userId } = params;
        const isExist = yield isItemExistInCart({ product_id: productId });

        if (isExist === 0) {
            throw new Error("ItemNotExistInCartError");
        } else {
            const cartUpdate = yield Cart.update({
                quantity: quantity
            }, {
                where: {
                    product_id: productId,
                    user_id: userId
                }
            });

            return cartUpdate;
        }
    });

    return function updateItem(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

// ======================================================
//  * * * * * * * * * * Delete cart * * * * * * * * * * *
// ======================================================


let removeItem = (() => {
    var _ref3 = _asyncToGenerator(function* (params) {
        const { productId, userId } = params;
        const isExist = yield isItemExistInCart({ product_id: productId });
        if (isExist === 0) {
            throw new Error("ItemNotExistInCartError");
        } else {
            const cartDeletion = yield Cart.destroy({
                where: {
                    product_id: productId,
                    user_id: userId
                }
            });

            return cartDeletion;
        }
    });

    return function removeItem(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

// ======================================================
//  * * * * Validation if Cart or Product Exist * * * * * 
// ======================================================


let isItemExistInCart = (() => {
    var _ref4 = _asyncToGenerator(function* (params) {
        const isExist = yield Cart.count({
            where: {
                product_id: params.product_id,
                user_id: params.userId
            }
        });

        return isExist;
    });

    return function isItemExistInCart(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

let getAll = (() => {
    var _ref5 = _asyncToGenerator(function* (params) {
        const { userId } = params;

        const cartQuery = yield Cart.findAll({
            where: {
                user_id: userId
            },
            include: [{
                model: Product,
                required: true
            }]
        });

        return cartQuery;
    });

    return function getAll(_x5) {
        return _ref5.apply(this, arguments);
    };
})();

let isProductExist = (() => {
    var _ref6 = _asyncToGenerator(function* (params) {
        const isExist = yield Product.count({
            where: {
                id: params.product_id
            }
        });

        return isExist;
    });

    return function isProductExist(_x6) {
        return _ref6.apply(this, arguments);
    };
})();

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Cart, Product } = _models2.default;exports.addItem = addItem;
exports.updateItem = updateItem;
exports.removeItem = removeItem;
exports.isItemExistInCart = isItemExistInCart;
exports.isProductExist = isProductExist;
exports.getAll = getAll;