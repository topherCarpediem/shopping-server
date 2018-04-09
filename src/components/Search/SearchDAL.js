import model from "../../models";

const { Product } = model
const { Op } = model.Sequelize

async function search(keyword) {

    const productSearch = await Product.findAll({
        where: {
            productName: {
                [Op.like]: `%${keyword}%`
            }
        }
    })

    return productSearch   
}


export {
    search
}