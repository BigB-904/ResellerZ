const saleService =
require("../services/saleService");

async function createSale(req,res)
{
    try
    {
        const id =
        await saleService.createSale(req.body);

        res.json(
        {
            success:true,
            message:"Sale created successfully",
            saleId:id
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