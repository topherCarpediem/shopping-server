import model from "../../models";
import { Router } from "express";
import bodyParser from "body-parser";
import { tokenMiddleware } from "../../components/Token";

import { cartDAL } from "../Cart";
import { updateStocks } from "../Product";

const { isItemExistInCart,  } = cartDAL

const Order = Router()

Order.use(tokenMiddleware)
Order.use(bodyParser.json())
Order.use(bodyParser.urlencoded({ extended: false }))

Order.post("/checkout/:productId", (req, res) => {
    const { productId } = req.params
    const { quantity } = req.body
    
    console.log(productId)

    updateStocks({
        productId: productId,
        quantity: quantity
    }).then(result => {
        console.log(result)
        // insert query to order table
    }).catch(err => {
        handleError(err.message)
    })
})



function handleError(err) {
    switch (err) {
        case "OrderGreaterThanStocksError":
            console.log("OrderGreaterThanStocksError meanong ad")
            break;
    
        default:
            break;
    }
}

export default Order