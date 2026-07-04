const purchaseModel =
require("../models/purchaseModel");

async function getPurchases()
{
    return await purchaseModel.getPurchases();
}

async function createPurchase(data)
{
    if(!data.supplierId)
    {
        throw new Error("Supplier is required");
    }

    if(!data.items || data.items.length === 0)
    {
        throw new Error("Purchase must have items");
    }

    return await purchaseModel.createPurchase(data);
}

module.exports =
{
    getPurchases,
    createPurchase
};