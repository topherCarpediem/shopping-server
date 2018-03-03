import { createServer } from "http";
import app from "./app"
import models from "./models";

models.sequelize.authenticate()
.then(() => {
    console.log("Connected to the database engine")
    models.sequelize.sync({ force: true})
    .then(context => {
        const server = createServer(app);
        server.listen(3000, () => { console.log(`Listening on port ${server.address().port}`)})
    })
}).catch(err => {
    console.log(err)
})

  
