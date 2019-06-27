"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.search = undefined;

let search = (() => {
    var _ref = _asyncToGenerator(function* (keyword) {

        const productSearch = yield Product.findAll({
            where: {
                productName: {
                    [Op.like]: `%${keyword}%`
                }
            }
        });

        return productSearch;
    });

    return function search(_x) {
        return _ref.apply(this, arguments);
    };
})();

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Product } = _models2.default;
const { Op } = _models2.default.Sequelize;

exports.search = search;