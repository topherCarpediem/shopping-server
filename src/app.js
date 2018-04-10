import express from "express";

import { userAPI } from "./components/User";
import { cartAPI } from "./components/Cart";
import { orderAPI } from "./components/Order";
import { CategoryAPI } from "./components/Category";
import productAPI from "./components/Product/ProductAPI"
import feedbackAPI from "./components/Feedback/Feedback"
import { SearchAPI } from "./components/Search";
import Chat from "./components/Chat/Chat";

//global.__imageLink = "http://10.24.202.102:3001/product/images/";
//global.__imageLink = "http://192.168.8.103:3001/product/images/";
global.__imageLink = "http://10.24.120.15:3001/product/images/";


const app = express()

app.use('/user', userAPI)
app.use('/cart', cartAPI)
app.use('/order', orderAPI)
app.use('/product', productAPI)
app.use('/category', CategoryAPI)
app.use('/feedback', feedbackAPI)
app.use('/search', SearchAPI)
app.use('/chat', Chat)

export default app;


