"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _validateToken = require("./validateToken");

var _validateToken2 = _interopRequireDefault(_validateToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ======================================================
// * * * * Middleware that handles authentication * * * *
// ======================================================
exports.default = (req, res, next) => {
    let validationResult = null;
    let authHeader = null;

    try {
        authHeader = req.headers.authorization.split(" ");
        if (authHeader.length != 2 || authHeader[0] != "Bearer") {
            res.setHeader('Content-Type', 'application/json');
            res.status(401).end(JSON.stringify({
                message: "Unauthorized request",
                reason: "The format of the token is invalid. Please use Bearer token"
            }));
        } else {
            validationResult = (0, _validateToken2.default)(authHeader[1]);
            if (validationResult.type === "unauthorized") {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).end(JSON.stringify({
                    message: "Unauthorized request",
                    reason: validationResult.data.message
                }));
            } else {
                req.id = validationResult.data.id;
                next();
            }
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).end(JSON.stringify({
            message: "Unauthorized request",
            reason: "Unable to detect the authorization token"
        }));
    }
};