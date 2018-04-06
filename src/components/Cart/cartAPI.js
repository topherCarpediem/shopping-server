import { Router } from "express"
import bodyParser from "body-parser";
import { addItem, updateItem, removeItem, getAll } from "./cartDAL";
import { tokenMiddleware } from "../Token";

const Cart = Router()

Cart.use(tokenMiddleware)
Cart.use(bodyParser.json())
Cart.use(bodyParser.urlencoded({ extended: false }))

// ======================================================
//  * * * * * * Enpoint that will add cart * * * * * * * 
// ======================================================
Cart.post("/add", (req, res) => {
    const { quantity, productId } = req.body

    const cartContext = {
        quantity: quantity,
        product_id: productId,
        user_id: req.id
    }

    addItem(cartContext).then(result => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({
            message: "Successfully added to the cart"
        }))
    }).catch(err => {
        handleError(err.message, res)
    })

})

// ======================================================
//  * * * * * * Enpoint that will update cart * * * * * *
// ======================================================
Cart.put("/update/:productId", (req, res) => {
    const { productId } = req.params
    const { quantity } = req.body
    const userId = req.id

    const cartContext = {
        productId: productId,
        quantity: quantity,
        userId: userId
    }

    updateItem(cartContext)
        .then(result => {

            if (result[0] !== 0) {
                res.setHeader("Content-type", "application/json")
                res.status(200).end(JSON.stringify({
                    message: "Successfully updated the cart"
                }))
            } else {
                res.setHeader("Content-type", "application/json")
                res.status(404).end(JSON.stringify({
                    message: "The cart did not process your request. Maybe the product id or user id is mismatch"
                }))
            }
        })
        .catch(err => {
            handleError(err.message, res)
        })
})


Cart.get("/all", (req, res) => {
    getAll({ userId: req.id }).then(result => {

        const dataValues = result.map(cart => {
            cart.dataValues.product.imageCover = `${__imageLink}${cart.dataValues.product.imageCover}`
            return cart.dataValues
        })
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(dataValues))
        return res
    }).catch(err => {
        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: err.message
        }))
        return res
    })
})


// ======================================================
//  * * * * * * Enpoint that will delete cart * * * * * *
// ======================================================
Cart.delete("/delete/:productId", (req, res) => {

    const { productId } = req.params
    const userId = req.id
    const cartContext = {
        productId: productId,
        userId: userId
    }

    removeItem(cartContext)
        .then(result => {

            if (result[0] !== 0) {
                res.setHeader("Content-type", "application/json")
                res.status(200).end(JSON.stringify({
                    message: "Successfully deleted the cart"
                }))
            } else {
                res.setHeader("Content-type", "application/json")
                res.status(404).end(JSON.stringify({
                    message: "The cart did not process your request. Maybe the product id or user id is mismatch"
                }))
            }
        })
        .catch(err => {
            handleError(err.message, res)
        })
})


// ======================================================
//  * * * * Function that handles the error thrown * * * 
// ======================================================
function handleError(err, res) {
    switch (err) {

        case "ItemExistInCartError":
            res.setHeader("Content-type", "application/json")
            res.status(400).end(JSON.stringify({
                message: "Item already exist in the cart"
            }))
            break;

        case "ProductNotExistError":
            res.setHeader("Content-type", "application/json")
            res.status(400).end(JSON.stringify({
                message: "Product not exist"
            }))

        case "ItemNotExistInCartError":
            res.setHeader("Content-type", "application/json")
            res.status(400).end(JSON.stringify({
                message: "The item is not exist in the cart"
            }))

        case "OwnItemError":
            res.setHeader("Content-type", "application/json")
            res.status(400).end(JSON.stringify({
                message: "Cannot add your own item to cart!"
            }))
            
        default:
            break;
    }

    console.log(err)
}


export default Cart