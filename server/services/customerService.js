const customerModel = require("../models/customerModel");

async function getAllCustomers()
{
    return await customerModel.getAllCustomers();
}

async function addCustomer(customer)
{
    return await customerModel.addCustomer(customer);
}

async function deleteCustomer(customerId)
{
    return await customerModel.deleteCustomer(customerId);
}

async function updateCustomer(customer)
{
    return await customerModel.updateCustomer(customer);
}

module.exports =
{
    getAllCustomers,
    addCustomer,
    deleteCustomer,
    updateCustomer
};