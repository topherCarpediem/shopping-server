import { Router } from "express"
import bodyParser from "body-parser";

const Cart = Router()

Cart.use(bodyParser.json())
Cart.use(bodyParser.urlencoded({ extended: false }))

Cart.post("/add", (req, res) => {
    console.log(req.body)
})


export default Cart