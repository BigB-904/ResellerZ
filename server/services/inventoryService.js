const inventoryModel =
require("../models/inventoryModel");

async function getInventory()
{
    return await inventoryModel.getInventory();
}

async function getInventoryStats()
{
    return await inventoryModel.getInventoryStats();
}

async function getTransactions(productId)
{
    return await inventoryModel.getTransactions(productId);
}

async function stockIn(product)
{
    if(product.quantity<=0)
    {
        throw new Error("Invalid Quantity");
    }

    await inventoryModel.stockIn(product);
}

async function stockOut(product)
{
    if(product.quantity<=0)
    {
        throw new Error("Invalid Quantity");
    }

    await inventoryModel.stockOut(product);
}

module.exports =
{
    getInventory,
    getInventoryStats,
    getTransactions,
    stockIn,
    stockOut
};