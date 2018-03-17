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

// Add products to the database
Products.post("/add", tokenValidation, upload.single('avatar'), (req, res) => {
    
    let old = path.join(process.cwd(), req.file.path)
    fs.renameSync(old, old+".png")

    const productDetails = {
        productName: "Levies shooes",
        productPrice:  100.80,
        productOldPrice: 80.25,
        productDescription: "The sample description",
        imageCover: `${req.file.filename}.png`,
        isActive: true,
        
        user_id: req.id
    }

    Product.create(productDetails).then(res => {
        console.log(res.dataValues)
    })

    res.status(200).end(JSON.stringify({
        hello: "asdasd"
    }))
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

        if(result.length === 0){
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



function tokenValidation(req, res, next){
    let validationResult = null
    let authHeader = null

    try {
        authHeader =  req.headers.authorization.split(" ")
    } catch (error) {
        res.setHeader('Content-Type', 'application/json')
        res.status(401).end(JSON.stringify({
            message: "Unauthorized request",
            reason: "Unable to detect the authorization token"
        })) 
    }

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