import { Router } from "express";


const Admin = Router()


Admin.get('/orders', (req, res) => {

    Order.findAll()
})


export default Admin