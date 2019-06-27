'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkIfOwnItem = exports.pickup = exports.order = exports.purchases = exports.checkout = undefined;

let checkout = (() => {
    var _ref = _asyncToGenerator(function* (params) {

        const orderCreated = yield Order.bulkCreate(params);
        return orderCreated;
    });

    return function checkout(_x) {
        return _ref.apply(this, arguments);
    };
})();

let purchases = (() => {
    var _ref2 = _asyncToGenerator(function* (id) {
        const orders = yield Order.findAll({
            where: {
                user_id: id
            },
            order: [['created_at', 'DESC']],
            include: [{
                model: Product,
                required: true
            }]
        });

        return orders;
    });

    return function purchases(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

let order = (() => {
    var _ref3 = _asyncToGenerator(function* ({ orderId, userId }) {
        const order = yield Order.find({
            where: {
                user_id: userId,
                id: orderId
            },
            include: [{
                model: Product,
                required: true
            }]
        });

        return order;
    });

    return function order(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

let pickup = (() => {
    var _ref4 = _asyncToGenerator(function* (userId) {
        const order = yield Order.findAll({
            include: [{
                model: Product,
                where: {
                    user_id: userId
                },
                required: true
            }]
        });

        return order;
    });

    return function pickup(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

let checkIfOwnItem = (() => {
    var _ref5 = _asyncToGenerator(function* (userId, productId) {
        const product = yield Product.count({
            where: {
                id: productId,
                user_id: userId
            }
        });

        return product;
    });

    return function checkIfOwnItem(_x5, _x6) {
        return _ref5.apply(this, arguments);
    };
})();

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Order, Product } = _models2.default;

exports.checkout = checkout;
exports.purchases = purchases;
exports.order = order;
exports.pickup = pickup;
exports.checkIfOwnItem = checkIfOwnItem;