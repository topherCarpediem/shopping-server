"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _express = require("express");

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _Token = require("../../components/Token");

var _Product = require("../Product");

var _orderDAL = require("./orderDAL");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Order = (0, _express.Router)();

Order.use(_Token.tokenMiddleware);
Order.use(_bodyParser2.default.json());
Order.use(_bodyParser2.default.urlencoded({ extended: false }));

Order.post("/checkout", (req, res) => {
    //const { productId } = req.params

    let productDetailsBody = null;
    let errorInSchemma = false;
    const { productDetails } = req.body;

    try {
        productDetailsBody = JSON.parse(productDetails);

        if (typeof productDetailsBody === "string") {
            productDetailsBody = JSON.parse(productDetailsBody);
        }
    } catch (error) {

        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: "Unable to parse the data in the body"
        }));

        return res;
    }

    for (let index = 0; index < productDetailsBody.length; index++) {
        const element = productDetailsBody[index];
        if (typeof element.id === "undefined" || typeof element.quantity === "undefined") {
            errorInSchemma = true;
            break;
        }
    }

    if (errorInSchemma) {
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: "Schema of the parameter is invalid"
        }));
        return res;
    }

    //console.log(productDetailsBody)

    (0, _Product.updateStocks)({
        productDetails: productDetailsBody,
        userId: req.id
    }).then(result => {
        //console.log(result)
        const temp = [];
        productDetailsBody.forEach(element => {
            temp.push({
                quantity: element.quantity,
                orderStatus: "Processing",
                orderType: "COD",
                orderShippingAddress: element.shippingAddress,
                user_id: req.id,
                product_id: element.id,
                created_at: new Date(),
                updated_at: new Date()
            });
        });

        return (0, _orderDAL.checkout)(temp);
    }).then(checkedout => {
        console.log('checked out');

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify({
            message: "Order(s) processing"
        }));
    }).catch(err => {
        handleError(err.message, res);
    });
});

Order.get('/purchases', (req, res) => {
    const id = req.id;

    (0, _orderDAL.purchases)(id).then(result => {
        //console.log(result)
        const orders = result.map(order => {
            order.dataValues.product.imageCover = `${__imageLink}${order.dataValues.product.imageCover}`;
            return order.dataValues;
        });

        //console.log(orders)
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(orders));

        return;
    }).catch(err => {
        console.log(err);
    });
});

Order.get('/pickup', (req, res) => {
    const id = req.id;

    (0, _orderDAL.pickup)(id).then(result => {
        //console.log(result)
        // const orders = result.map(order => {
        //     order.dataValues.product.imageCover = `${__imageLink}${order.dataValues.product.imageCover}`
        //     return order.dataValues
        // })
        const productOrdered = result.map(order => {
            order.dataValues.product.dataValues.imageCover = `${__imageLink}${order.dataValues.product.dataValues.imageCover}`;
            //return order.dataValues.product.dataValues
            return order.dataValues;
        });
        console.log(productOrdered);
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(productOrdered));

        return;
    }).catch(err => {
        console.log(err);
    });
});

Order.get('/:orderId', (req, res) => {
    const userId = req.id;
    const { orderId } = req.params;
    //console.log(userId)
    //console.log(req.params)

    if (typeof orderId === 'undefined') {
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: "Order id cannot be null"
        }));
        return;
    }

    (0, _orderDAL.order)({ userId, orderId }).then(result => {

        if (result === null) {
            throw new Error("OrderNotFoundError");
        }

        result.dataValues.product.imageCover = `${__imageLink}${result.dataValues.product.imageCover}`;
        const orderQuery = result.dataValues;

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(orderQuery));
        return;
    }).catch(err => {

        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: err.message
        }));
        return;
    });
});

function handleError(err, res) {
    switch (err) {
        case "OrderGreaterThanStocksError":
            console.log("OrderGreaterThanStocksError meanong ad");
            res.setHeader("Content-type", "application/json");
            res.status(400).end(JSON.stringify({
                message: "Order is greater than the stocks"
            }));
            break;

        case "ProductNotExistError":
            console.log("Product doesnt exist");
            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify({
                message: "Product does not exist"
            }));

        case "OwnItemError":

            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify({
                message: "Cannot purchase your own item"
            }));
        default:
            break;
    }
    console.log(err);
}

exports.default = Order;