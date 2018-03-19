import { Router } from "express"
import bodyParser from "body-parser";
import { addItem } from "./cartDAL";
import { tokenMiddleware } from "../Token";

const Cart = Router()

Cart.use(tokenMiddleware)
Cart.use(bodyParser.json())
Cart.use(bodyParser.urlencoded({ extended: false }))

Cart.post("/add", async (req, res) => {
    const { quantity, productId } = req.body
    const cartContext = {
        quantity,
        productId,
        userId: req.id
    }

    const reult = await addItem(cartContext)
    console.log(reult)
})


export default Cart