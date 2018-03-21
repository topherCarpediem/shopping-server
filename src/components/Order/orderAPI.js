import model from "../../models";
import { Router } from "express";
import bodyParser from "body-parser";
import { tokenMiddleware } from "../../components/Token";

import { updateStocks } from "../Product";
import { checkout } from "./orderDAL";

const Order = Router()

Order.use(tokenMiddleware)
Order.use(bodyParser.json())
Order.use(bodyParser.urlencoded({ extended: false }))

Order.post("/checkout/:productId", (req, res) => {
    const { productId } = req.params
    const { quantity } = req.body

    updateStocks({
        productId: productId,
        quantity: quantity
    }).then(result => {
        console.log(result)
        // insert query to order table
        return checkout({
            quantity: quantity,
            orderStatus: "Processing",
            orderType: "COD",
            orderShippingAddress: "Tanauan Batangas",
            user_id: req.id,
            product_id: productId
        })
    }).then(checkouted => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({
            message: "Order is in process"
        }))
    }).catch(err => {
        handleError(err.message, res)
    })
})



function handleError(err, res) {
    switch (err) {
        case "OrderGreaterThanStocksError":
            console.log("OrderGreaterThanStocksError meanong ad")
            res.setHeader("Content-type", "application/json")
            res.status(400).end(JSON.stringify({
                message: "Order is greater than the stocks"
            }))
            break;

        case "ProductNotExistError":
            console.log("Product doesnt exist")
            res.setHeader("Content-type", "application/json")
            res.status(404).end(JSON.stringify({
                message: "Product does not exist"
            }))
        default:
            break;
    }
    console.log(err)
}

export default Order