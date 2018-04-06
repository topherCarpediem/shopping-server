import express from "express";

import { userAPI } from "./components/User";
import { cartAPI } from "./components/Cart";
import { orderAPI } from "./components/Order";
import { CategoryAPI } from "./components/Category";
import productAPI from "./components/Product/ProductAPI"
import feedbackAPI from "./components/Feedback/Feedback"

global.__imageLink = "http://10.24.202.102:3001/product/images/";
//global.__imageLink = "http://192.168.8.103:3001/product/images/";

const app = express()

app.use('/user', userAPI)
app.use('/cart', cartAPI)
app.use('/order', orderAPI)
app.use('/product', productAPI)
app.use('/category', CategoryAPI)
app.use('/feedback', feedbackAPI)

export default app;


