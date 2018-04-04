import models from "../../models";

const { Order, Product } = models


async function checkout(params) {
    
    const orderCreated = await Order.bulkCreate(params)
    return orderCreated
    
}

async function purchases(id){
    const orders = await Order.findAll({
        where: {
            user_id : id
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


export { checkout, purchases, order }