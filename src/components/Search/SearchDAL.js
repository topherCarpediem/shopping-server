import model from "../../models";

const { Product, ProductFeature } = model
const { Op } = model.Sequelize

async function search(keyword) {

    const productSearch = await Product.findAll({
        where: {
            productName: {
                [Op.like]: `%${keyword}%`
            }
        },
        include: [{
            model: ProductFeature
        }]
    })

    return productSearch   
}


export {
    search
}