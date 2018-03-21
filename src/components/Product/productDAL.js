import model from "../../models";

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
    const { quantity, productId } = params

    return Product.find({
        where: {
            id: productId,
        }
    }).then(result => {
        if (result === null) {
            throw new Error("ProductNotExistError")
        }
        const { dataValues } = result
        if (dataValues.stocks < quantity) {
            throw new Error("OrderGreaterThanStocksError")
        }
        return dataValues
    }).then(productDetails => {

        return StockTrail.create({
            currentStock: productDetails.stocks,
            out: quantity,
            product_id: productId
        }).then(stocks => {
            return Product.update({
                stocks: productDetails.stocks - quantity
            }, {
                where: {
                    id: productId,
                }
            })
        })
    })
}



export { updateStocks }
