import { Router } from "express";
import models from "../../models";

const { Order } = models
const Home = Router();


Home.get('/index', (req, res) => {


    res.render('home')


})


Home.get('/orders', (req, res) => {

    Order.findAll({
        where: {
            orderStatus: "Pending"
        },
        include: [{
            model: models.Product,
            required: true,
            include: [{
                model: models.User,
                required: true
            }]
        }, {
            model: models.User,
            required: true
        }]
    }).then(result => {

        const dataValues = result.map(order => {
            // order.dataValues.product.dataValues.imageCover = `${__imageLink}${order.dataValues.product.dataValues.imageCover}`
            // return order.dataValues
            return [
                order.id,
                order.product.productName,
                "&#8369;" + order.product.productPrice.toFixed(2),
                order.product.stocks,
                `${order.user.firstName} ${order.user.lastName}`,
                `${order.product.user.firstName} ${order.product.user.lastName}`,
            ]

        });

        res.setHeader('Content-type', 'application/json')
        res.status(200).end(JSON.stringify({ data: dataValues }))
        return
    }).catch(err => {
        console.log(err)
    })

})



Home.get('/order/:orderId', (req, res) => [
    Order.find({
        where: {
            id: req.params.orderId
        },
        include: [{
            model: models.Product,
            required: true,
        }, {
            model: models.User,
            required: true,
            include: [{
                model: models.Address,
                required: true
            }]
        }],
    }).then(result => {

        res.setHeader("Content-type", "application/json")

        if (result !== null) {
            result.dataValues.product.dataValues.imageCover = `${__imageLink}${result.dataValues.product.dataValues.imageCover}`
            const { password, ...userDetails } = result.dataValues.user.dataValues
            result.dataValues.user.dataValues = userDetails
            
            res.status(200).end(JSON.stringify(result))
            return
        }

        res.status(404).end(JSON.stringify({ message: "No order found" }))
        return
    })
])


Home.put('/order/:orderId', (req, res) => {

    Order.update({ orderStatus: "Processing"}, {
        where: {
            id: req.params.orderId
        }
    }).then(result => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({
            message: "Order is now on process"
        }))
        return
    })
})



export default Home