"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _User = require("./components/User");

var _Cart = require("./components/Cart");

var _Order = require("./components/Order");

var _Category = require("./components/Category");

var _ProductAPI = require("./components/Product/ProductAPI");

var _ProductAPI2 = _interopRequireDefault(_ProductAPI);

var _Feedback = require("./components/Feedback/Feedback");

var _Feedback2 = _interopRequireDefault(_Feedback);

var _Search = require("./components/Search");

var _Chat = require("./components/Chat/Chat");

var _Chat2 = _interopRequireDefault(_Chat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//global.__imageLink = "http://10.24.202.102:3001/product/images/";
//global.__imageLink = "http://192.168.8.103:3001/product/images/";
global.__imageLink = "http://10.24.120.15:3001/product/images/";

const app = (0, _express2.default)();

app.use('/user', _User.userAPI);
app.use('/cart', _Cart.cartAPI);
app.use('/order', _Order.orderAPI);
app.use('/product', _ProductAPI2.default);
app.use('/category', _Category.CategoryAPI);
app.use('/feedback', _Feedback2.default);
app.use('/search', _Search.SearchAPI);
app.use('/chat', _Chat2.default);

exports.default = app;