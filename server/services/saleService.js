const saleModel =
require("../models/saleModel");

async function createSale(data)
{
    if(!data.customerId)
    {
        throw new Error("Customer is required");
    }

    if(!data.items || data.items.length === 0)
    {
        throw new Error("Sale must have items");
    }

    return await saleModel.createSale(data);
}

module.exports =
{
    createSale
};