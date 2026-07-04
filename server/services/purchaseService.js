const purchaseModel =
require("../models/purchaseModel");

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
    createPurchase
};