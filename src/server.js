import { createServer } from "https";
import { readFileSync } from "fs";
import app from "./app"
import models from "./models";

const privateKey = readFileSync("ssl/private.key")
const certificate = readFileSync("ssl/certificate.crt")

const options = {
    key: privateKey,
    cert: certificate
}

models.sequelize.authenticate()
.then(() => {
    console.log("Connected to the database engine")
    models.sequelize.sync({ force: true})
    .then(context => {
        const server = createServer(options, app);
        server.listen(3000, () => { console.log(`Listening on port ${server.address().port}`)})
    })
}).catch(err => {
    console.log(err)
})

  
