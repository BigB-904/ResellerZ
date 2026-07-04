const purchaseService =
require("../services/purchaseService");

async function createPurchase(req,res)
{
    try
    {
        const id =
        await purchaseService.createPurchase(req.body);

        res.json(
        {
            success:true,
            message:"Purchase created successfully",
            purchaseId:id
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
    createPurchase
};