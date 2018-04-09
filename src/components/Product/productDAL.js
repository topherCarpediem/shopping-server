import model from "../../models";

const { Op } = model.Sequelize

const { Product, StockTrail } = model


async function addProduct(params) {
    const productDetails = {
        productName: params.productName,
        productPrice: params.productPrice,
        productOldPrice: params.productOldPrice,
        productDescription: params.productDescription,
        imageCover: params.imageCover,
        isActive: params.isActive
    }

    Product.create()
}


function updateStocks(params) {
    const { productDetails, userId } = params
    //console.log(productDetails)
    const productIds = productDetails.map(product => product.id)

    return Product.findAll({
        where: {
            id: {
                [Op.or]: productIds
            }
        }
    }).then(result => {
        if (result.length === 0) {
            throw new Error("ProductNotExistError")
        }
        const products = result.map(product => {
            return product.dataValues
        })

        products.forEach(product => {
            productDetails.forEach(prod => {
                if (product.id === prod.id) {
                    if (product.stocks < prod.quantity) {
                        throw new Error("OrderGreaterThanStocksError")
                    }
		    if(product.user_id === userId){
                        throw new Error("OwnItemError")
		    }
                }
            })
        })

        return products

    }).then(products => {

        
        let setters = ''
        let condition = ''

        const temp = []

        products.forEach(product => {
            productDetails.forEach(prod => {
                if (product.id === prod.id) {

                    setters += `WHEN '${product.id}' THEN ${product.stocks - prod.quantity} `
                    condition += `'${product.id}',`

                    temp.push({
                        currentStock: product.stocks,
                        out: prod.quantity,
                        product_id: product.id,
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                }
            })
        })

        const rawQuery = `
        UPDATE products  
        SET stocks = CASE id 
        ${setters} 
        END 
        WHERE id IN (${condition.slice(0, -1)})`

        
        return StockTrail.bulkCreate(temp).then(result => {
            //console.log(result)
            return model.sequelize.query(rawQuery)
        })
    })
}



export { updateStocks }
