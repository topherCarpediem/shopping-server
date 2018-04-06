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
        console.log(result)
    }).catch(err => {
        console.log(err)
    })
})


FeedbackRoute.get('/:productId', (req, res) => {
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
            return feedbacks.dataValues
        })

        console.log(feedbacks)

    }).catch(err => {
        console.log(err)
    })
})



export default FeedbackRoute