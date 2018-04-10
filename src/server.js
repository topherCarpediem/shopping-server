import { createServer } from "http";
import { readFileSync } from "fs";
import app from "./app"
import models from "./models";

const privateKey = readFileSync("ssl/private.key")
const certificate = readFileSync("ssl/certificate.crt")

const options = {
    key: privateKey,
    cert: certificate
}

const categories = [
    {name: "Men's Clothing", icon: "male"},
    {name: "Women's Clothing", icon: "female"},
    {name: "Shoes and Footwear", icon: "foot"},
    {name: "Laptops and Computers", icon: "computer"},
    {name: "Mobile Phones and Tablets", icon: "mobile"},
    {name: "Watches and Jewelries", icon: "watch"},
    {name: "Cars and Automotives", icon: "car"},
    {name: "Motorcycles and Motogears", icon: "motorcycle"},
    {name: "Bags and Luggages", icon: "shopping-bag"}]

const category = categories.map(category => {
    return {
        name: category.name,
        icon: category.icon,
        created_at: new Date(),
        updated_at: new Date()
    }
})

models.sequelize.authenticate()
    .then(() => {
        console.log("Connected to the database engine")
        models.sequelize.sync({  })
            .then(context => {
                //const server = createServer(options, app);
                // models.Category.bulkCreate(category).then(result => {
                //    console.log(result)
                // })
                const server = createServer(app);
                server.listen(3001, () => { console.log(`Listening on port ${server.address().port}`) })
            })
    }).catch(err => {
        console.log(err)
    })


