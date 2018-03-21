import models from "../../models";

const { Order } = models


async function checkout(params) {
    const orderDetails = {
        quantity: params.quantity,
        orderStatus: params.orderStatus,
        orderType: params.orderType,
        orderShippingAddress: params.orderShippingAddress,
        user_id: params.user_id,
        product_id: params.product_id
    }
    const orderCreated = await Order.create({
        ...orderDetails
    })

    return orderCreated
}


export { checkout }