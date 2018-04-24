import { Router } from "express";
import { search } from "./SearchDAL";
const Search = Router()



Search.get('/:keyword', (req, res) => {
    
    search(req.params.keyword).then(result => {
        const searchResult = result.map(product => {
            //console.log(product.productFeatures)
            product.dataValues.imageCover = `${__imageLink}${product.dataValues.imageCover}`
            return product.dataValues
        })
        
        res.setHeader("Content-type", "application/json")
        res.status(200).end(JSON.stringify(searchResult))
        //console.log(searchResult)
        return
    }).catch(err => {
        console.log(err)
    })
})


export default Search