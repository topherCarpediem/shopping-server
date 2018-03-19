import model from "../../models";


const { Cart } = model

async function addItem(params) {
    const {quantity, productId, userId } = params
    const createdItem = Cart.create({ 
        quantity,
        productId,
        userId
    }).then(createdItem => {
        console.log(createdItem)
    })
}


async function editItem(params) {
    
}


async function removeItem(params) {
    
}


export { addItem }