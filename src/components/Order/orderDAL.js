import models from "../../models";
const { Op } = models.Sequelize;
const { Order, Product } = models


async function checkout(params) {
    
    const orderCreated = await Order.bulkCreate(params)
    return orderCreated
    
}

async function purchases(id){
    const orders = await Order.findAll({
        where: {
            user_id : id,
            orderStatus: {
                [Op.not]: "Pending"
            }
        },
        order: [
            ['created_at', 'DESC']
        ],
        include: [{
            model: Product,
            required: true
        }]
    })

    return orders
}

async function order({ orderId, userId}){
    const order = await Order.find({
        where: {
            user_id: userId,
            id: orderId
        },
        include: [{
            model: Product,
            required: true
        }]
    })

    return order
}

async function pickup(userId){
    const order = await Order.findAll({
        include: [{
            model: Product,
            where: {
                user_id: userId
            },
            required: true
        }]
    })

    return order
}

async function checkIfOwnItem(userId, productId){
    const product = await Product.count({
	where: {
	    id: productId,
	    user_id: userId
	}
    })

    return product
}


export { checkout, purchases, order, pickup, checkIfOwnItem }
