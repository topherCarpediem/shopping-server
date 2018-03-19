import express from "express";

import { userAPI } from "./components/User";
import { cartAPI } from "./components/Cart";
import productAPI from "./components/Product/ProductAPI"

global.__imageLink = "http://127.0.0.1:3001/product/images/";

const app = express()

app.use('/user', userAPI)
app.use('/cart', cartAPI)
app.use('/product', productAPI)

export default app;


