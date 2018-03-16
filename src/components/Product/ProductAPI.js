import fs from "fs";
import path from "path";
import os from "os"

import multer from "multer";
import { Router } from "express";
import model from "../../models";
import { validateToken } from "../Token";

const { Product, Category } = model

const upload = multer({ dest: 'uploads/' })
const Products = Router();

Products.post("/add", tokenValidation, upload.single('avatar'), (req, res) => {
    // console.log(req.id)
    // console.log(req.file)

    
    let old = path.join(process.cwd(), req.file.path)
    fs.renameSync(old, old+".png")

    const productDetails = {
        productName: "Levies shooes",
        productPrice:  100.80,
        productOldPrice: 80.25,
        productDescription: "The sample description",
        imageCover: `${req.file.filename}.png`,
        isActive: true,
        category_id: "6853bd35-2a2d-4557-a9c5-c213aae96e55",
        user_id: req.id
    }

    Product.create(productDetails).then(res => {
        console.log(res.dataValues)
    })

    res.status(200).end(JSON.stringify({
        hello: "asdasd"
    }))
})

Products.get("/image", (req, res) => {
    Product.findAll().then(res => {
        return res.map(product => {
            product.dataValues.imageCover = `https://127.0.0.1:3001/product/images/${product.dataValues.imageCover}`
            return product.dataValues
        })
    }).then(product => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(product))
    })
    //fs.createReadStream(path.join(process.cwd(), "uploads\\f5ed7a402e252f6d5dc2ddf5888393b1"+".png")).pipe(res)
})



function tokenValidation(req, res, next){
    let validationResult = null
    const authHeader = req.headers.authorization.split(" ")

    if(authHeader.length != 2 || authHeader[0] != "Bearer") {
        res.setHeader('Content-Type', 'application/json')
        res.status(401).end(JSON.stringify({
            message: "Unauthorized request",
            reason: "The format of the token is invalid. Please use Bearer token"
        }))
    } else {
        validationResult = validateToken(authHeader[1])
        if(validationResult.type === "unauthorized"){
            console.log(validationResult.data)   
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
}

export default Products