const purchaseModel =
require("../models/purchaseModel");

module.exports =
{
    getPurchases:
    purchaseModel.getPurchases,

    createPurchase:
    purchaseModel.createPurchase,

    getPurchaseDetails:
    purchaseModel.getPurchaseDetails
};