import model from "../../models";
import { Router } from "express";
import bodyParser from "body-parser";
import { tokenMiddleware } from "../../components/Token";

import { updateStocks } from "../Product";
import { checkout, purchases, order, pickup } from "./orderDAL";

const Order = Router()
const { Cart } = model
const { Op } = model.Sequelize

Order.use(tokenMiddleware)
Order.use(bodyParser.json())
Order.use(bodyParser.urlencoded({ extended: false }))

Order.post("/checkout", (req, res) => {
    //const { productId } = req.params

    let productDetailsBody = null
    let errorInSchemma = false
    const { productDetails } = req.body

    try {
        productDetailsBody = JSON.parse(productDetails)

        if (typeof productDetailsBody === "string") {
            productDetailsBody = JSON.parse(productDetailsBody)
        }

    } catch (error) {

        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: "Unable to parse the data in the body"
        }))

        return res

    }


    for (let index = 0; index < productDetailsBody.length; index++) {
        const element = productDetailsBody[index];
        if (typeof element.id === "undefined" || typeof element.quantity === "undefined") {
            errorInSchemma = true
            break;
        }

    }

    if (errorInSchemma) {
        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: "Schema of the parameter is invalid"
        }))
        return res
    }

    //console.log(productDetailsBody)

    updateStocks({
        productDetails: productDetailsBody,
	    userId: req.id
    }).then(result => {
        //console.log(result)
        const temp = []
        productDetailsBody.forEach(element => {
            temp.push({
                quantity: element.quantity,
                orderStatus: "Pending",
                orderType: "COD",
                orderShippingAddress: element.shippingAddress,
                user_id: req.id,
                product_id: element.id,
                created_at: new Date(),
                updated_at: new Date()
            })
        });
        
        return checkout(temp)

    }).then(checkedout => {
        console.log('checked out')

        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({
            message: "Order(s) processing"
        }))

        const prod = productDetailsBody.map(product => product.id)

        Cart.destroy({
            where:{
                product_id: {
                    [Op.or]: prod
                },
                user_id: req.id
            }
        }).then(cart => {

        }).catch(err => {

        })

    }).catch(err => {
        handleError(err.message, res)
    })

})


Order.get('/purchases', (req, res) => {
    const id = req.id

    purchases(id).then(result => {
        //console.log(result)
        const orders = result.map(order => {
            order.dataValues.product.imageCover = `${__imageLink}${order.dataValues.product.imageCover}`
            return order.dataValues
        })

        //console.log(orders)
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(orders))

        return

    }).catch(err => {
        console.log(err)
    })

})

Order.get('/pickup', (req, res) => {
    const id = req.id

    pickup(id).then(result => {
        //console.log(result)
        // const orders = result.map(order => {
        //     order.dataValues.product.imageCover = `${__imageLink}${order.dataValues.product.imageCover}`
        //     return order.dataValues
        // })
        const  productOrdered = result.map(order => {
            order.dataValues.product.dataValues.imageCover = `${__imageLink}${order.dataValues.product.dataValues.imageCover}`
            //return order.dataValues.product.dataValues
            return order.dataValues
        })
        console.log(productOrdered)
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(productOrdered))

        return

    }).catch(err => {
        console.log(err)
    })

})


Order.get('/:orderId', (req, res) => {
    const userId = req.id
    const { orderId } = req.params
    //console.log(userId)
    //console.log(req.params)

    if (typeof orderId === 'undefined') {
        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: "Order id cannot be null"
        }))
        return
    }

    order({ userId, orderId }).then(result => {
        
        if(result === null){
            throw new Error("OrderNotFoundError")
        }

        result.dataValues.product.imageCover = `${__imageLink}${result.dataValues.product.imageCover}`
        const orderQuery = result.dataValues

        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(orderQuery))
        return

    }).catch(err => {

        res.setHeader("Content-type", "application/json")
        res.status(400).end(JSON.stringify({
            message: err.message
        }))
        return

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

	case "OwnItemError":

            res.setHeader("Content-type", "application/json")
            res.status(404).end(JSON.stringify({
                message: "Cannot purchase your own item"
            }))
        default:
            break;
    }
    console.log(err)
}

export default Order
