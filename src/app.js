import express from "express";

import { userAPI } from "./components/User";
import productAPI from "./components/Product/ProductAPI"

global.__imageLink = "http://127.0.0.1:3001/product/images/";

const app = express()


import compression from "compression";
app.use(compression())
app.use('/user', userAPI)
app.use('/product', productAPI)

export default app;


