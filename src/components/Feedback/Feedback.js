import { Router } from "express";
import bodyParser from "body-parser";

import model from "../../models";
import { tokenMiddleware } from "../Token";

const FeedbackRoute = Router()

FeedbackRoute.use(bodyParser.json())
FeedbackRoute.use(bodyParser.urlencoded({ extended: false }))


FeedbackRoute.post('/add/:productId', tokenMiddleware, (req, res) => {
    const { message } = req.body

    model.Feedback.create({
        message: message,
        user_id: req.id,
        product_id: req.params.productId
    }).then(result => {
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify({
            message: "Added a comment"
        }))
        return
    }).catch(err => {
        console.log(err)
    })
})

FeedbackRoute.get('/getall/:productId', (req, res) => {
    model.Feedback.findAll({
        where: {
            product_id: req.params.productId
        },
        include: [{
            model: model.User,
            required: true
        }]
    }).then(result => {
        //console.log(result)
        const feedbacks = result.map(feedback => {
            return feedback.dataValues
        })

        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(feedbacks))

        //console.log(feedbacks)
        return

    }).catch(err => {
        console.log(err)
    })
})

FeedbackRoute.get('/limit/:productId', (req, res) => {
    model.Feedback.findAll({
        where: {
            product_id: req.params.productId
        },
        include: [{
            model: model.User,
            required: true
        }],
        limit: 5
    }).then(result => {
        //console.log(result)
        const feedbacks = result.map(feedback => {
            return feedback.dataValues
        })

        //console.log(result)
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(feedbacks))

        return

    }).catch(err => {
        console.log(err)
    })
})






export default FeedbackRoute