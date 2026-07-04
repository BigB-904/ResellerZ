const inventoryModel =
require("../models/inventoryModel");

module.exports =
{
    getInventory:
    inventoryModel.getInventory,

    getTransactions:
    inventoryModel.getTransactions,

    stockIn:
    inventoryModel.stockIn,

    stockOut:
    inventoryModel.stockOut
};