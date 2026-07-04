const supplierService =
require("../services/supplierService");

async function getAllSuppliers(req,res)
{
    try
    {
        const suppliers =
        await supplierService.getAllSuppliers();

        res.json(
        {
            success:true,

            message:"Suppliers retrieved successfully.",

            data:suppliers
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

async function getSupplier(req,res)
{
    try
    {
        const supplier =
        await supplierService.getSupplier(req.params.id);

        if(!supplier)
        {
            return res.status(404).json(
            {
                success:false,

                message:"Supplier not found."
            });
        }

        res.json(
        {
            success:true,

            data:supplier
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

async function addSupplier(req,res)
{
    try
    {
        await supplierService.addSupplier(req.body);

        res.json(
        {
            success:true,

            message:"Supplier added successfully."
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json(
        {
            success:false,

            message:"Unable to add supplier."
        });
    }
}

async function updateSupplier(req,res)
{
    try
    {
        await supplierService.updateSupplier(
        req.params.id,
        req.body);

        res.json(
        {
            success:true,

            message:"Supplier updated successfully."
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json(
        {
            success:false,

            message:"Unable to update supplier."
        });
    }
}

async function deleteSupplier(req,res)
{
    try
    {
        await supplierService.deleteSupplier(
        req.params.id);

        res.json(
        {
            success:true,

            message:"Supplier deleted successfully."
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json(
        {
            success:false,

            message:"Unable to delete supplier."
        });
    }
}

module.exports =
{
    getAllSuppliers,

    getSupplier,

    addSupplier,

    updateSupplier,

    deleteSupplier
};