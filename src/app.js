import express from "express";

import { userAPI } from "./components/User";
import productAPI from "./components/Product/ProductAPI"

global.__basedir = __dirname;

const app = express()

app.use('/user', userAPI)
app.use('/product', productAPI)

export default app;


