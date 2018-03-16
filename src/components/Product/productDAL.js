import model from "../../models";

const { Product } = model


async function addProduct(args) {
    const productDetails = {
        productName: args.productName,
        productPrice: args.productPrice ,
        productOldPrice: args.productOldPrice,
        productDescription: args.productDescription,
        imageCover: args.imageCover,
        isActive: args.isActive
    }
    
    Product.create()
}
