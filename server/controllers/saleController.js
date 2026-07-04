const saleService =
require("../services/saleService");

async function createSale(req,res)
{
    try
    {
        const result =
        await saleService.createSale(req.body);

        res.json(
        {
            success:true,
            message:"Sale created successfully",
            data:
            {
                saleId: result.saleId,
                invoiceId: result.invoiceId
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

module.exports =
{
    createSale
};