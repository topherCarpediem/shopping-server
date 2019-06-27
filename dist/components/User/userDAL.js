"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.profile = exports.verifyUser = exports.createUser = exports.isUserExist = undefined;

// Find one user with exact emailAddress
let isUserExist = (() => {
    var _ref = _asyncToGenerator(function* (emailAddress) {
        const res = yield User.findOne({
            where: {
                emailAddress
            }
        });
        return res;
    });

    return function isUserExist(_x) {
        return _ref.apply(this, arguments);
    };
})();

// Insert user in the database


let createUser = (() => {
    var _ref2 = _asyncToGenerator(function* (args) {
        //console.log(args)
        // const userDetails = args
        // userDetails.password = hashPassword(userDetails.password)
        // const userCreation = await User.create(userDetails)
        // return userCreation
        let { firstName, lastName, emailAddress, password } = args,
            address = _objectWithoutProperties(args, ["firstName", "lastName", "emailAddress", "password"]);
        const addressCreated = yield Address.create(address);
        password = hashPassword(password);
        const userCreation = yield User.create({
            firstName,
            lastName,
            emailAddress,
            password,
            address_id: addressCreated.id
        });
        return userCreation;
        //console.log(addressCreated.dataValues)
    });

    return function createUser(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

let profile = (() => {
    var _ref3 = _asyncToGenerator(function* (userId) {
        const profile = yield User.find({
            where: {
                id: userId
            },
            include: [{
                model: Address,
                required: true
            }]
        });

        return profile;
    });

    return function profile(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

// Verify if the user exist in the record


let verifyUser = (() => {
    var _ref4 = _asyncToGenerator(function* (args) {

        const emailAddress = args.emailAddress;
        const password = args.password;

        const queryResult = yield isUserExist(emailAddress);

        if (queryResult === null) {
            throw new Error("UserNotFoundError");
        }

        const isPasswordMatch = yield _bcrypt2.default.compare(password, queryResult.dataValues.password);

        if (!isPasswordMatch) {
            throw new Error("PasswordMatchError");
        } else {
            return queryResult.dataValues;
        }
    });

    return function verifyUser(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

// Hash the password using bcrypt with saltRound of 12


var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { User, Address } = _models2.default;function hashPassword(plainPassword) {
    const saltRound = 12;
    return _bcrypt2.default.hashSync(plainPassword, saltRound);
}

exports.isUserExist = isUserExist;
exports.createUser = createUser;
exports.verifyUser = verifyUser;
exports.profile = profile;