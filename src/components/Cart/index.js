import cartAPI from "./cartAPI";
import { addItem, removeItem, updateItem, isItemExistInCart, isProductExist } from "./cartDAL"

const cartDAL = {
    addItem,
    removeItem,
    updateItem,
    isItemExistInCart,
    isProductExist
}

export {
    cartAPI,
    cartDAL
}