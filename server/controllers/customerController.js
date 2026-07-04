const customerService = require("../services/customerService");

async function getAllCustomers(req, res)
{
    try
    {
        const customers = await customerService.getAllCustomers();

        res.json({
            success: true,
            message: "Customers retrieved successfully.",
            data: customers
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to retrieve customers."
        });
    }
}

async function addCustomer(req, res)
{
    try
    {
        const
        {
            firstName,
            lastName,
            phone,
            email,
            address,
            city
        } = req.body;

        if (!firstName || !lastName || !phone)
        {
            return res.status(400).json({
                success: false,
                message: "First name, last name and phone are required."
            });
        }

        const customer = await customerService.addCustomer({
            firstName,
            lastName,
            phone,
            email,
            address,
            city
        });

        res.status(201).json({
            success: true,
            message: "Customer added successfully.",
            data: customer
        });
    }
    catch (error)
    {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to add customer."
        });
    }
}

async function deleteCustomer(req, res)
{
    try
    {
        const customerId = req.params.id;

        await customerService.deleteCustomer(customerId);

        res.json(
        {
            success: true,
            message: "Customer deleted successfully."
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json(
        {
            success:false,
            message:"Unable to delete customer."
        });
    }
}

async function updateCustomer(req, res)
{
    try
    {
        await customerService.updateCustomer({
            id: req.params.id,
            ...req.body
        });

        res.json({
            success: true
        });
    }
    catch (err)
    {
        res.status(500).json({
            success: false,
            message: "Failed to update customer"
        });
    }
}

module.exports =
{
    getAllCustomers,
    addCustomer,
    deleteCustomer,
    updateCustomer
};