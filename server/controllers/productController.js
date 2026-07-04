const productService = require("../services/productService");

async function getAllProducts(req, res)
{
    try
    {
        const products = await productService.getAllProducts();

        res.json({
            success: true,
            message: "Products retrieved successfully.",
            data: products
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve products."
        });
    }
}

async function getProductById(req, res)
{
    try
    {
        const product = await productService.getProductById(req.params.id);

        if (!product)
        {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.json({
            success: true,
            data: product
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error."
        });
    }
}

async function addProduct(req, res)
{
    try
    {
        const product = req.body;

        if (
            !product.productName ||
            !product.sku ||
            product.purchasePrice === undefined ||
            product.salePrice === undefined
        )
        {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        await productService.addProduct(product);

        res.json({
            success: true,
            message: "Product added successfully."
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add product."
        });
    }
}

async function updateProduct(req, res)
{
    try
    {
        await productService.updateProduct(req.params.id, req.body);

        res.json({
            success: true,
            message: "Product updated successfully."
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to update product."
        });
    }
}

async function deleteProduct(req, res)
{
    try
    {
        await productService.deleteProduct(req.params.id);

        res.json({
            success: true,
            message: "Product deleted successfully."
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete product."
        });
    }
}

module.exports =
{
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};