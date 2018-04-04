import { Router } from "express";
import models from "../../models";
import category from "../../models/category";

const Category = Router()

Category.get('/', (req, res) => {
    models.Category.findAll().then(result => {
        const categoryResult = result.map(category => {
            return category.dataValues
        })
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(categoryResult))
        
    })
})

// Category.post('/bulkadd', (req, res) => {
//     const bodyCategory = JSON.parse(req.body.categories)
//     const category = bodyCategory.map(category => {
//         return {
//             name: category,
//             created_at: new Date(),
//             updated_at: new Date()
//         }
//     })

//     models.Category.bulkCreate(category).then(result => {

//     })
// })


export default Category