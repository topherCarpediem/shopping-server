"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _userDAL = require("./userDAL");

var _Token = require("../Token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const User = (0, _express.Router)();

// Add middleware to get the body of request
User.use(_bodyParser2.default.json());
User.use(_bodyParser2.default.urlencoded({ extended: true }));

// Create new user
User.post('/register', sanitizeRegisterBody, (() => {
    var _ref = _asyncToGenerator(function* (req, res) {

        const emailAddress = req.body.emailAddress;

        (0, _userDAL.isUserExist)(emailAddress).then(function (result) {
            return result === null ? true : false;
        }).then(function (isUnique) {
            if (!isUnique) {
                throw new Error("UserAlreadyExistError");
            } else {
                return (0, _userDAL.createUser)(req.body);
            }
        }).then(function (createdUser) {
            const _createdUser$dataValu = createdUser.dataValues,
                  { password } = _createdUser$dataValu,
                  userDetails = _objectWithoutProperties(_createdUser$dataValu, ["password"]);
            sendResponse(res, { message: userDetails });
        }).catch(function (err) {
            handleError(err, res);
        });
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());

// Login a user
User.post('/login', sanitizeLoginBody, (req, res) => {
    const { password, emailAddress } = req.body;

    const userCredentials = {
        password,
        emailAddress
    };

    (0, _userDAL.verifyUser)(userCredentials).then(userDetails => {

        const payload = { id: userDetails.id };
        const generatedToken = (0, _Token.generateToken)(payload);

        const message = {
            message: "Successfully created a token, this can be used as an access pass for the API",
            token: generatedToken,
            emailAddress: userCredentials.emailAddress,
            dateCreated: new Date()
        };

        sendResponse(res, { message });
    }).catch(err => {
        handleError(err, res);
    });
});

User.get('/profile', _Token.tokenMiddleware, (req, res) => {
    (0, _userDAL.profile)(req.id).then(result => {
        sendResponse(res, { message: result.dataValues });
    }).catch(err => {
        console.log(err);
    });
});

// Gracefully handle errors
function handleError(err, res) {
    let responseMessage = null;
    switch (err.message) {

        case "UserAlreadyExistError":
            responseMessage = { message: "User is already exist." };
            sendResponse(res, {
                message: responseMessage,
                status: 400
            });
            break;

        case "UserNotFoundError":
            responseMessage = { message: "Unauthorize access, user not found" };
            sendResponse(res, {
                message: responseMessage,
                status: 401
            });
            break;

        case "PasswordMatchError":
            responseMessage = { message: "Unauthorize access, password is invalid" };
            sendResponse(res, {
                message: responseMessage,
                status: 401
            });
            break;

        default:
            res.setHeader('Content-Type', 'application/json');
            res.status(500).end(JSON.stringify({ message: err.message }));
            break;
    }
}

// Verification middleware for registration body
function sanitizeRegisterBody(req, res, next) {

    if (typeof req.body.emailAddress !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Email address must be passed and must be a string" }));
    } else if (typeof req.body.firstName !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "First Name must be passed and must be a string" }));
    } else if (typeof req.body.lastName !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Last Name must be passed and must be a string" }));
    } else if (typeof req.body.password !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Password must be passed and must be a string" }));
    } else if (req.body.password.length > 50) {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Password must be 50 characters below" }));
    } else {
        next();
    }
}

// Verification middleware for login body
function sanitizeLoginBody(req, res, next) {
    if (typeof req.body.emailAddress !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Email address must be passed and must be a string" }));
    } else if (typeof req.body.password !== "string") {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).end(JSON.stringify({ message: "Password must be passed and must be a string" }));
    } else {
        next();
    }
}

// Handle the response. Following the principle of DRY (Don't Repeat Yourself)
function sendResponse(res, { message, status = 200 }) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).end(JSON.stringify(message));
}
exports.default = User;