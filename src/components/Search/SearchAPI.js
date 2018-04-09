import { Router } from "express";
import { search } from "./SearchDAL";
const Search = Router()



Search.get('/:keyword', (req, res) => {
    
    search(req.params.keyword).then(result => {
        const searchResult = result.map(product => {
            product.dataValues.imageCover = `${__imageLink}${product.dataValues.imageCover}`
            return product.dataValues
        })

        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(searchResult))

        return
    }).catch(err => {
        console.log(err)
    })
})


export default Search