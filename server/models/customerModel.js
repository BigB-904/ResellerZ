const sql = require("mssql");

async function getAllCustomers()
{
    const result = await sql.query(`
        SELECT
            CustomerID,
            FirstName,
            LastName,
            Phone,
            Email,
            Address,
            City,
            Balance,
            CreatedAt
        FROM Customers
        ORDER BY CustomerID DESC
    `);

    return result.recordset;
}

async function addCustomer(customer)
{
    const request = new sql.Request();

    request.input("FirstName", sql.NVarChar(100), customer.firstName);
    request.input("LastName", sql.NVarChar(100), customer.lastName);
    request.input("Phone", sql.NVarChar(20), customer.phone);
    request.input("Email", sql.NVarChar(150), customer.email);
    request.input("Address", sql.NVarChar(255), customer.address);
    request.input("City", sql.NVarChar(100), customer.city);

    const result = await request.query(`
        INSERT INTO Customers
        (
            FirstName,
            LastName,
            Phone,
            Email,
            Address,
            City
        )
        OUTPUT INSERTED.*
        VALUES
        (
            @FirstName,
            @LastName,
            @Phone,
            @Email,
            @Address,
            @City
        )
    `);

    return result.recordset[0];
}

async function deleteCustomer(customerId)
{
    const request = new sql.Request();

    request.input("CustomerID", sql.Int, customerId);

    await request.query(`
        DELETE FROM Customers
        WHERE CustomerID = @CustomerID
    `);

    return true;
}

async function updateCustomer(customer)
{
    const request = new sql.Request();

    request.input("CustomerID", sql.Int, customer.id);
    request.input("FirstName", sql.NVarChar(100), customer.firstName);
    request.input("LastName", sql.NVarChar(100), customer.lastName);
    request.input("Phone", sql.NVarChar(20), customer.phone);
    request.input("Email", sql.NVarChar(150), customer.email);
    request.input("Address", sql.NVarChar(255), customer.address);
    request.input("City", sql.NVarChar(100), customer.city);

    await request.query(`
        UPDATE Customers
        SET
            FirstName = @FirstName,
            LastName = @LastName,
            Phone = @Phone,
            Email = @Email,
            Address = @Address,
            City = @City
        WHERE CustomerID = @CustomerID
    `);
}

module.exports =
{
    getAllCustomers,
    addCustomer,
    deleteCustomer,
    updateCustomer
};