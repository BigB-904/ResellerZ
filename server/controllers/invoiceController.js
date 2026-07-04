const invoiceService =
require("../services/invoiceService");

async function createInvoice(req,res)
{
    try
    {
        const data =
        await invoiceService.createInvoice(req.body.saleId);

        res.json(
        {
            success:true,
            message:"Invoice created",
            data:
            {
                invoiceId: data.InvoiceID
            }
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(400).json(
        {
            success:false,
            message:error.message
        });
    }
}

async function getInvoice(req,res)
{
    try
    {
        const data =
        await invoiceService.getInvoiceById(req.params.id);

        res.json(
        {
            success:true,
            data
        });
    }
    catch(error)
    {
        res.status(500).json(
        {
            success:false,
            message:"Server Error"
        });
    }
}

module.exports =
{
    createInvoice,
    getInvoice
};