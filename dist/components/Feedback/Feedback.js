"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _Token = require("../Token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FeedbackRoute = (0, _express.Router)();

FeedbackRoute.use(_bodyParser2.default.json());
FeedbackRoute.use(_bodyParser2.default.urlencoded({ extended: false }));

FeedbackRoute.post('/add/:productId', _Token.tokenMiddleware, (req, res) => {
    const { message } = req.body;

    _models2.default.Feedback.create({
        message: message,
        user_id: req.id,
        product_id: req.params.productId
    }).then(result => {
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify({
            message: "Added a comment"
        }));
        return;
    }).catch(err => {
        console.log(err);
    });
});

FeedbackRoute.get('/getall/:productId', (req, res) => {
    _models2.default.Feedback.findAll({
        where: {
            product_id: req.params.productId
        },
        include: [{
            model: _models2.default.User,
            required: true
        }]
    }).then(result => {
        //console.log(result)
        const feedbacks = result.map(feedback => {
            return feedback.dataValues;
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(feedbacks));

        //console.log(feedbacks)
        return;
    }).catch(err => {
        console.log(err);
    });
});

FeedbackRoute.get('/limit/:productId', (req, res) => {
    _models2.default.Feedback.findAll({
        where: {
            product_id: req.params.productId
        },
        include: [{
            model: _models2.default.User,
            required: true
        }],
        limit: 5
    }).then(result => {
        //console.log(result)
        const feedbacks = result.map(feedback => {
            return feedback.dataValues;
        });

        //console.log(result)
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(feedbacks));

        return;
    }).catch(err => {
        console.log(err);
    });
});

exports.default = FeedbackRoute;