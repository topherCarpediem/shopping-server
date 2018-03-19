import fs from "fs";
import path from "path";
import os from "os"

import multer from "multer";
import { Router } from "express";
import model from "../../models";
import { validateToken } from "../Token";
import bodyParser from "body-parser"

const { Product } = model

const upload = multer({ dest: 'uploads/' })
const Products = Router();

Products.use(tokenValidation)
Products.use(bodyParser.json())
Products.use(bodyParser.urlencoded({ extended: false }))


// ======================================================
// * * * * * * Add products to the database * * * * * * *
// ======================================================
Products.post("/add", upload.single('avatar'), (req, res) => {

    let old = path.join(process.cwd(), req.file.path)
    fs.renameSync(old, old + ".png")

    const productDetails = {
        productName: req.body.productName,
        productPrice: req.body.productPrice,
        stocks: req.body.stocks,
        productDescription: req.body.productDescription,
        imageCover: `${req.file.filename}.png`,
        isActive: true,
        user_id: req.id
    }

    Product.create(productDetails).then(result => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(result.dataValues))
    }).catch(err => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({ message: err.message }))
    })
})

// ======================================================
//  * * * * * * * * Edit product details. * * * * * * * *
// ======================================================
Products.put("/edit/:productId", (req, res) => {

    let productDetails = {}
    const { productName, productPrice, stocks, productDescription, isActive } = req.body

    if (productName !== undefined)
        productDetails.productName = productName
    if (productPrice !== undefined)
        productDetails.productPrice = productPrice
    if (stocks !== undefined)
        productDetails.stocks = stocks
    if (productDescription !== undefined)
        productDetails.productDescription = productDescription
    if (req.body.isActive !== undefined)
        productDetails.isActive = isActive

    if (Object.keys(productDetails).length === 0) {
        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: "No field is is being updated"
        }))
    } else {

        Product.find({
            where: {
                id: req.params.productId
            }
        }).then(result => {
            if (result === null) {
                throw new Error("ProductNotFoundError")
            } else {
                return result.dataValues
            }
        }).then(dataValues => {

            if (productPrice !== undefined)
                productDetails.productOldPrice = dataValues.productPrice

            Product.update({ ...productDetails }, {
                where: {
                    id: req.params.productId
                }
            }).then(result => {
                res.setHeader("Content-type", "application/json")
                res.status(200).end(JSON.stringify({
                    message: "Successfully updated the product information"
                }))
            })

        }).catch(err => {
            res.setHeader("Content-type", "application/json")
            res.status(404).end(JSON.stringify({
                message: "Cannot find productId."
            }))
        })
    }
})

// ======================================================
//  * * * * * * * * Delete product * * * * * * * *
// ======================================================
Products.delete("/delete/:productId", (req, res) => {
    res.setHeader("Content-type", "application/json")

    const { productId } = req.params

    Product.destroy({
        where: {
            id: productId
        }
    }).then(result => {
        if(result === 0){
            res.status(404).end(JSON.stringify({
                message: "Product did not exist. No item deleted"
            }))
        }else {
            res.status(200).end(JSON.stringify({
                message: "Successfully deleted the product"
            }))
        }
    })
})

// ======================================================
// * * * Retrive product with pagination technique. * * * 
// ======================================================
Products.get("/page/:pagenumber", (req, res) => {
    const { pagenumber } = req.params
    const pageOffset = pagenumber > 1 ? pagenumber * 20 : 0

    Product.findAll({
        order: [
            ['created_at', 'DESC'],
        ],
        offset: pageOffset,
        limit: 20,
    }).then(result => {

        let dataValues = null

        if (result.length === 0) {
            dataValues = {
                message: "Page not found."
            }
            res.setHeader("Content-type", "application/json")
            res.status(404).end(JSON.stringify(dataValues))
        } else {
            dataValues = result.map(productItem => {
                productItem.dataValues.imageCover = `${__imageLink}${productItem.dataValues.imageCover}`
                return productItem.dataValues
            });
            res.setHeader("Content-type", "application/json")
            res.status(200).end(JSON.stringify(dataValues))
        }
    })
})


// ======================================================
// * * * * * * * * * * Download image * * * * * * * * * *
// ======================================================
Products.get("/images/:imagename", (req, res) => {

    let filePath = path.join(process.cwd(), `uploads\\${req.params.imagename}`)
    const myReadStream = fs.createReadStream(filePath)

    myReadStream.on("error", error => {
        console.log("Returning invalid image because image not found")
        filePath = path.join(process.cwd(), `src\\images\\error.PNG`)
        fs.createReadStream(filePath).pipe(res)
    })

    myReadStream.pipe(res)
})


// ======================================================
// * * * * Middleware that handles authentication * * * *
// ======================================================
function tokenValidation(req, res, next) {
    let validationResult = null
    let authHeader = null

    try {
        authHeader = req.headers.authorization.split(" ")
        if (authHeader.length != 2 || authHeader[0] != "Bearer") {
            res.setHeader('Content-Type', 'application/json')
            res.status(401).end(JSON.stringify({
                message: "Unauthorized request",
                reason: "The format of the token is invalid. Please use Bearer token"
            }))
        } else {
            validationResult = validateToken(authHeader[1])
            if (validationResult.type === "unauthorized") {
                res.setHeader('Content-Type', 'application/json')
                res.status(401).end(JSON.stringify({
                    message: "Unauthorized request",
                    reason: validationResult.data.message
                }))
            } else {
                req.id = validationResult.data.id
                next()
            }
        }
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(401).end(JSON.stringify({
            message: "Unauthorized request",
            reason: "Unable to detect the authorization token"
        }))
    }
}

export default Products