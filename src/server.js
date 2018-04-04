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

const categories = ["Men's Clothing",
    "Women's Clothing",
    "Shoes and Footwear",
    "Laptops and Computers",
    "Mobile Phones and Tablets",
    "Watches and Jewelries",
    "Cars and Automotives",
    "Motorcycles and Motogears",
    "Bags and Luggages"]

const category = categories.map(category => {
    return {
        name: category,
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
                //     console.log(result)
                // })
                const server = createServer(app);
                server.listen(3001, () => { console.log(`Listening on port ${server.address().port}`) })
            })
    }).catch(err => {
        console.log(err)
    })


