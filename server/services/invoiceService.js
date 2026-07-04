const invoiceModel =
require("../models/invoiceModel");

async function createInvoice(saleId)
{
    if(!saleId)
    {
        throw new Error("Sale ID required");
    }

    return await invoiceModel.createInvoice(saleId);
}

async function getInvoiceById(id)
{
    return await invoiceModel.getInvoiceById(id);
}

module.exports =
{
    createInvoice,
    getInvoiceById
};