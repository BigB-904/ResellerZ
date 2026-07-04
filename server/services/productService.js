const productModel = require("../models/productModel");

async function getAllProducts()
{
    return await productModel.getAllProducts();
}

async function getProductById(productId)
{
    return await productModel.getProductById(productId);
}

async function addProduct(product)
{
    return await productModel.addProduct(product);
}

async function updateProduct(productId, product)
{
    return await productModel.updateProduct(productId, product);
}

async function deleteProduct(productId)
{
    return await productModel.deleteProduct(productId);
}

module.exports =
{
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};