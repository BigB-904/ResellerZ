const purchaseService =
require("../services/purchaseService");

async function getPurchases(req,res)
{
    try
    {
        const data =
        await purchaseService.getPurchases();

        res.json(
        {
            success:true,
            data:data
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json(
        {
            success:false,
            message:"Server Error"
        });
    }
}

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
    getPurchases,
    createPurchase
};