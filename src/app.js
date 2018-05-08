import path from "path"
import express from "express";

import { userAPI } from "./components/User";
import { cartAPI } from "./components/Cart";
import { orderAPI } from "./components/Order";
import { CategoryAPI } from "./components/Category";
import productAPI from "./components/Product/ProductAPI"
import feedbackAPI from "./components/Feedback/Feedback"
import { SearchAPI } from "./components/Search";
import Chat from "./components/Chat/Chat";
import Home from "./components/Home/homeAPI"

//global.__imageLink = "http://10.24.202.0:3001/product/images/";
//global.__imageLink = "http://10.24.202.113:3001/product/images/";
global.__imageLink = "http://192.168.8.101:3001/product/images/";


const app = express()

// View engine
app.use('/public', express.static(process.cwd() + '/src/public' ))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public/views'))

// Routes
app.use('/user', userAPI)
app.use('/cart', cartAPI)
app.use('/order', orderAPI)
app.use('/product', productAPI)
app.use('/category', CategoryAPI)
app.use('/feedback', feedbackAPI)
app.use('/search', SearchAPI)
app.use('/chat', Chat)
app.use('/home', Home)

export default app;


