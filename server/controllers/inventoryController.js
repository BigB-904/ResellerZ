const inventoryService =
require("../services/inventoryService");

async function getInventory(req,res)
{
    try
    {
        const data =
        await inventoryService.getInventory();

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

async function getTransactions(req,res)
{
    try
    {
        const data =
        await inventoryService.getTransactions(
        req.params.id);

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

async function stockIn(req,res)
{
    try
    {
        await inventoryService.stockIn(req.body);

        res.json(
        {
            success:true,
            message:"Stock updated."
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

async function stockOut(req,res)
{
    try
    {
        await inventoryService.stockOut(req.body);

        res.json(
        {
            success:true,
            message:"Stock updated."
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

module.exports =
{
    getInventory,
    getTransactions,
    stockIn,
    stockOut
};