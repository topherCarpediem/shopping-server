"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = token => {
    const secretKey = "5e3cdc509e6c91feb9cedd4669441864a9e65b60c057c3cb00c18a0c61eece8d0d2b74612003ca7b22bde779695bc97aed33b1949cea1235192e15d6d22511d6";
    const bufferedSecretKey = new Buffer(secretKey, "base64");
    const options = {
        algorithm: "HS256",
        audience: "https://bsushopping.com",
        issuer: "https://bsushopping.com"

    };

    let result = {
        type: "",
        data: {}
    };

    _jsonwebtoken2.default.verify(token, bufferedSecretKey, options, (err, decoded) => {
        if (err === null) {
            result.type = "authenticated";
            result.data = _extends({}, decoded);
        } else {
            result.type = "unauthorized";
            result.data = { message: err.message };
        }
    });

    //console.log(result)
    return result;
};