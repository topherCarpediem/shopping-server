import model from "../../models";

const { Cart, Product } = model

// ======================================================
//  * * * * * * * * Add item to Cart * * * * * * * *
// ======================================================
async function addItem(params) {
    const isProduct = await isProductExist({ product_id: params.product_id })

    if (isProduct === 0) {
        throw new Error("ProductNotExistError")
    }

    const isExist = await isItemExistInCart({ product_id: params.product_id })
    if (isExist !== 0) {
        throw new Error("ItemExistInCartError")
    } else {
        const createdItem = await Cart.create({ ...params })
        return createdItem
    }
}

// ======================================================
//  * * * * * * * * Update item in Cart * * * * * * * *
// ======================================================
async function updateItem(params) {
    const { productId, quantity, userId } = params
    const isExist = await isItemExistInCart({ product_id: productId })
    if (isExist === 0) {
        throw new Error("ItemNotExistInCartError")
    } else {
        const cartUpdate = await Cart.update(
            {
                quantity: quantity
            },
            {
                where: {
                    product_id: productId,
                    user_id: userId
                }
            })

        return cartUpdate
    }
}

// ======================================================
//  * * * * * * * * * * Delete cart * * * * * * * * * * *
// ======================================================
async function removeItem(params) {
    const { productId, userId } = params
    const isExist = await isItemExistInCart({ product_id: productId })
    if (isExist === 0) {
        throw new Error("ItemNotExistInCartError")
    } else {
        const cartDeletion = await Cart.destroy(
            {
                where: {
                    product_id: productId,
                    user_id: userId
                }
            })

        return cartDeletion
    }
}

// ======================================================
//  * * * * Validation if Cart or Product Exist * * * * * 
// ======================================================
async function isItemExistInCart(params) {
    const isExist = await Cart.count({
        where: {
            product_id: params.product_id
        }
    })

    return isExist
}

async function isProductExist(params) {
    const isExist = await Product.count({
        where: {
            id: params.product_id
        }
    })

    return isExist
}


export { addItem, updateItem, removeItem, isItemExistInCart, isProductExist }