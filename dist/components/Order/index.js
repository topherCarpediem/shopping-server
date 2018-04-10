"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.orderDAL = exports.orderAPI = undefined;

var _orderAPI = require("./orderAPI");

var _orderAPI2 = _interopRequireDefault(_orderAPI);

var _orderDAL = require("./orderDAL");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const orderDAL = {
    checkout: _orderDAL.checkout
};

exports.orderAPI = _orderAPI2.default;
exports.orderDAL = orderDAL;