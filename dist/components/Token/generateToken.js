"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _ms = require("ms");

var _ms2 = _interopRequireDefault(_ms);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = payload => {
    const secretKey = "5e3cdc509e6c91feb9cedd4669441864a9e65b60c057c3cb00c18a0c61eece8d0d2b74612003ca7b22bde779695bc97aed33b1949cea1235192e15d6d22511d6";
    const bufferedSecretKey = new Buffer(secretKey, "base64");
    const options = {
        algorithm: "HS256",
        expiresIn: "2 days",
        audience: "https://bsushopping.com",
        issuer: "https://bsushopping.com"
    };

    return _jsonwebtoken2.default.sign(payload, bufferedSecretKey, options);
};