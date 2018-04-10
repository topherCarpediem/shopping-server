"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _models = require("../../models");

var _models2 = _interopRequireDefault(_models);

var _express = require("express");

var _Token = require("../Token");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { Product, Tag, Order, User } = _models2.default;

const upload = (0, _multer2.default)({ dest: 'uploads/' });
const Products = (0, _express.Router)();

//Products.use(tokenMiddleware)
Products.use(_bodyParser2.default.json());
Products.use(_bodyParser2.default.urlencoded({ extended: false }));

// ======================================================
// * * * * * * Add products to the database * * * * * * *
// ======================================================
Products.post("/add", _Token.tokenMiddleware, upload.single('avatar'), (req, res) => {

    try {
        let old = _path2.default.join(process.cwd(), req.file.path);
        _fs2.default.renameSync(old, old + ".png");
    } catch (error) {
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({ message: "Cannot find the image in the request" }));
        return res;
    }

    const productDetails = {
        productName: req.body.productName,
        productPrice: parseFloat(req.body.productPrice).toFixed(2),
        stocks: req.body.stocks,
        productDescription: req.body.productDescription,
        imageCover: `${req.file.filename}.png`,
        isActive: 1,
        user_id: req.id,
        category_id: req.body.categoryId
    };

    const reqTags = JSON.parse(req.body.tags);

    Product.create(productDetails).then(result => {

        const tags = reqTags.map(tag => {
            const tagName = tag.replace("#", "");
            return {
                tagName,
                product_id: result.dataValues.id,
                created_at: new Date(),
                updated_at: new Date()
            };
        });

        //console.log(tags)

        Tag.bulkCreate(tags).then(tagResult => {
            res.setHeader("Content-type", "application/json");
            res.status(200).end(JSON.stringify(result.dataValues));
        }).catch(err => {
            res.setHeader("Content-type", "application/json");
            res.status(400).end(JSON.stringify({ message: err.message }));
        });
    }).catch(err => {
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({ message: err.message }));
    });

    //console.log(productDetails)
});

// ======================================================
//  * * * * * * * * Edit product details. * * * * * * * *
// ======================================================
Products.put("/edit/:productId", _Token.tokenMiddleware, (req, res) => {

    let productDetails = {};
    const { productName, productPrice, stocks, productDescription, isActive } = req.body;
    //console.log(req.body)
    if (productName !== undefined) productDetails.productName = productName;
    if (productPrice !== undefined) productDetails.productPrice = productPrice;
    if (stocks !== undefined) productDetails.stocks = stocks;
    if (productDescription !== undefined) productDetails.productDescription = productDescription;
    if (req.body.isActive !== undefined) productDetails.isActive = isActive;

    if (Object.keys(productDetails).length === 0) {
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: "No field is is being updated"
        }));
    } else {

        Product.find({
            where: {
                id: req.params.productId
            }
        }).then(result => {
            if (result === null) {
                throw new Error("ProductNotFoundError");
            } else {
                return result.dataValues;
            }
        }).then(dataValues => {

            if (productPrice !== undefined) productDetails.productOldPrice = dataValues.productPrice;

            Product.update(_extends({}, productDetails), {
                where: {
                    id: req.params.productId
                }
            }).then(result => {
                res.setHeader("Content-type", "application/json");
                res.status(200).end(JSON.stringify({
                    message: "Successfully updated the product information"
                }));
            });
        }).catch(err => {
            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify({
                message: "Cannot find productId."
            }));
        });
    }
});

// ======================================================
//  * * * * * * * * Delete product * * * * * * * *
// ======================================================
Products.delete("/delete/:productId", _Token.tokenMiddleware, (req, res) => {
    res.setHeader("Content-type", "application/json");

    const { productId } = req.params;

    Product.destroy({
        where: {
            id: productId
        }
    }).then(result => {
        if (result === 0) {
            res.status(404).end(JSON.stringify({
                message: "Product did not exist. No item deleted"
            }));
        } else {
            res.status(200).end(JSON.stringify({
                message: "SuccessfCreating SDD for Socket serverully deleted the product"
            }));
        }
    });
});

// ======================================================
// * * * Retrive product with pagination technique. * * * 
// ======================================================
Products.get("/page/:pagenumber", (req, res) => {
    const { pagenumber } = req.params;
    const pageOffset = pagenumber > 1 ? pagenumber * 20 : 0;

    Product.findAll({
        order: [['created_at', 'DESC']],
        offset: pageOffset,
        limit: 20
    }).then(result => {

        let dataValues = null;

        if (result.length === 0) {
            dataValues = {
                message: "Page not found."
            };
            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify(dataValues));

            return res;
        } else {
            dataValues = result.map(productItem => {
                productItem.dataValues.imageCover = `${__imageLink}${productItem.dataValues.imageCover}`;
                return productItem.dataValues;
            });
            res.setHeader("Content-type", "application/json");
            res.status(200).end(JSON.stringify(dataValues));

            return res;
        }
    });
});

Products.get("/seller", _Token.tokenMiddleware, (req, res) => {
    //const { pagenumber } = req.params
    //const pageOffset = pagenumber > 1 ? pagenumber * 20 : 0

    Product.findAll({
        where: {
            user_id: req.id
        },
        order: [['created_at', 'DESC']]
        // offset: pageOffset,
        // limit: 20,
    }).then(result => {

        let dataValues = null;

        if (result.length === 0) {
            dataValues = {
                message: "Page not found."
            };
            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify(dataValues));

            return res;
        } else {
            dataValues = result.map(productItem => {
                productItem.dataValues.imageCover = `${__imageLink}${productItem.dataValues.imageCover}`;
                return productItem.dataValues;
            });
            res.setHeader("Content-type", "application/json");
            res.status(200).end(JSON.stringify(dataValues));

            return res;
        }
    });
});

// ======================================================
// * * * * * * * * * * Download image * * * * * * * * * *
// ======================================================
Products.get("/images/:imagename", (req, res) => {

    let filePath = _path2.default.join(process.cwd(), `uploads/${req.params.imagename}`);
    const myReadStream = _fs2.default.createReadStream(filePath);

    myReadStream.on("error", error => {
        console.log("Returning invalid image because image not found");
        filePath = _path2.default.join(process.cwd(), `src/images/error.PNG`);
        _fs2.default.createReadStream(filePath).pipe(res);
    });
    res.setHeader("Content-type", "image/png");
    myReadStream.pipe(res);
});

Products.get("/:productId", (req, res) => {

    const { productId } = req.params;

    Product.find({
        where: {
            id: productId
        },
        include: [{
            model: User,
            required: true
        }]
    }).then(result => {

        let dataValues = null;

        if (result.length === 0) {
            dataValues = {
                message: "Product not found."
            };
            res.setHeader("Content-type", "application/json");
            res.status(404).end(JSON.stringify(dataValues));

            return;
        } else {

            result.dataValues.imageCover = `${__imageLink}${result.dataValues.imageCover}`;
            res.setHeader("Content-type", "application/json");
            res.status(200).end(JSON.stringify(result.dataValues));
            //console.log(result.dataValues)
            return;
        }
    }).catch(err => {
        //console.log(err)
        res.setHeader("Content-type", "application/json");
        res.status(400).end(JSON.stringify({
            message: err.message
        }));
    });
});

Products.get('/recommendation/:productId', (req, res) => {
    Product.find({
        where: {
            id: req.params.productId
        }
    }).then(result => {
        const product = result.dataValues;
        // console.log(product.dataValues)
        return Product.findAll({
            where: {
                category_id: product.category_id
            }
        });
        //console.log(result.dataValues.category_id)
    }).then(result => {

        const recommended = [];

        result.forEach(product => {
            if (product.dataValues.id !== req.params.productId) {
                product.dataValues.imageCover = `${__imageLink}${product.dataValues.imageCover}`;
                recommended.push(product.dataValues);
            }
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(recommended));

        return;
    }).catch(err => {
        console.log(err);
    });
});

Products.get('/order/:orderId', (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        const order = yield Order.find({
            where: {
                id: req.params.orderId
            },
            include: [{
                model: Product,
                required: true
            }]
        });

        //console.log(order)

        order.dataValues.product.dataValues.imageCover = `${__imageLink}${order.dataValues.product.dataValues.imageCover}`;
        //return order.dataValues.product.dataValues
        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify(order.dataValues));
        // return 
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());

Products.put('/pickup/:orderId', (() => {
    var _ref2 = _asyncToGenerator(function* (req, res) {
        const order = yield Order.update({
            orderStatus: "Shipped"
        }, {
            where: {
                id: req.params.orderId
            }
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify({
            message: "Pick up the product!"
        }));

        return;
    });

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
})());

Products.put('/deliver/:orderId', (() => {
    var _ref3 = _asyncToGenerator(function* (req, res) {
        const order = yield Order.update({
            orderStatus: "Delivered"
        }, {
            where: {
                id: req.params.orderId
            }
        });

        res.setHeader("Content-type", "application/json");
        res.status(200).end(JSON.stringify({
            message: "Product delivered!"
        }));
    });

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
})());

exports.default = Products;

// 1. Android Studio
// 2. Java Sdk
// 3. Android Sdk
// 4. NodeJs
// 5. VsCode(text editor lang to)
// 6. Watchman
// 7. MySql database engine(Kahit intsall na lang yung xampp e ok yun)
// 8. Postman