"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cartDAL = exports.cartAPI = undefined;

var _cartAPI = require("./cartAPI");

var _cartAPI2 = _interopRequireDefault(_cartAPI);

var _cartDAL = require("./cartDAL");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cartDAL = {
    addItem: _cartDAL.addItem,
    removeItem: _cartDAL.removeItem,
    updateItem: _cartDAL.updateItem,
    isItemExistInCart: _cartDAL.isItemExistInCart,
    isProductExist: _cartDAL.isProductExist
};

exports.cartAPI = _cartAPI2.default;
exports.cartDAL = cartDAL;