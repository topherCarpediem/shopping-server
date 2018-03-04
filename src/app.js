import express from "express";

import { userAPI } from "./components/User";

const app = express()

app.use('/user', userAPI)

export default app;


