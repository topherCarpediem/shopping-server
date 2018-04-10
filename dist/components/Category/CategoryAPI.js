"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _category = require("../../models/category");

var _category2 = _interopRequireDefault(_category);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Category = (0, _express.Router)();

Category.get('/', (req, res) => {
    _models2.default.Category.findAll().then(result => {
        const categoryResult = result.map(category => {
            return category.dataValues;
        });
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(categoryResult));
    });
});

Category.get('/:categoryId', (req, res) => {

    const { categoryId } = req.params;

    _models2.default.Product.findAll({
        where: {
            category_id: categoryId
        }
    }).then(result => {
        const categoryResult = result.map(category => {
            category.dataValues.imageCover = `${__imageLink}${category.dataValues.imageCover}`;
            return category.dataValues;
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(categoryResult));
    });
});

// Category.post('/bulkadd', (req, res) => {
//     const bodyCategory = JSON.parse(req.body.categories)
//     const category = bodyCategory.map(category => {
//         return {
//             name: category,
//             created_at: new Date(),
//             updated_at: new Date()
//         }
//     })

//     models.Category.bulkCreate(category).then(result => {

//     })
// })


exports.default = Category;