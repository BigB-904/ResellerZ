const sql = require("mssql");

async function getAllSuppliers()
{
    const result =
    await sql.query(`
    SELECT *
    FROM Suppliers
    ORDER BY SupplierID DESC
    `);

    return result.recordset;
}

async function getSupplier(id)
{
    const request =
    new sql.Request();

    request.input(
    "SupplierID",
    sql.Int,
    id);

    const result =
    await request.query(`
    SELECT *

    FROM Suppliers

    WHERE SupplierID=@SupplierID
    `);

    return result.recordset[0];
}

async function addSupplier(supplier)
{
    const request =
    new sql.Request();

    request.input(
    "CompanyName",
    sql.NVarChar(150),
    supplier.companyName);

    request.input(
    "ContactPerson",
    sql.NVarChar(100),
    supplier.contactPerson);

    request.input(
    "Phone",
    sql.NVarChar(30),
    supplier.phone);

    request.input(
    "Email",
    sql.NVarChar(120),
    supplier.email);

    request.input(
    "Address",
    sql.NVarChar(255),
    supplier.address);

    request.input(
    "City",
    sql.NVarChar(80),
    supplier.city);

    await request.query(`
    INSERT INTO Suppliers
    (
    CompanyName,
    ContactPerson,
    Phone,
    Email,
    Address,
    City
    )

    VALUES
    (
    @CompanyName,
    @ContactPerson,
    @Phone,
    @Email,
    @Address,
    @City
    )
    `);
}

async function updateSupplier(id,supplier)
{
    const request =
    new sql.Request();

    request.input(
    "SupplierID",
    sql.Int,
    id);

    request.input(
    "CompanyName",
    sql.NVarChar(150),
    supplier.companyName);

    request.input(
    "ContactPerson",
    sql.NVarChar(100),
    supplier.contactPerson);

    request.input(
    "Phone",
    sql.NVarChar(30),
    supplier.phone);

    request.input(
    "Email",
    sql.NVarChar(120),
    supplier.email);

    request.input(
    "Address",
    sql.NVarChar(255),
    supplier.address);

    request.input(
    "City",
    sql.NVarChar(80),
    supplier.city);

    await request.query(`
    UPDATE Suppliers

    SET

    CompanyName=@CompanyName,

    ContactPerson=@ContactPerson,

    Phone=@Phone,

    Email=@Email,

    Address=@Address,

    City=@City,

    UpdatedAt=GETDATE()

    WHERE SupplierID=@SupplierID
    `);
}

async function deleteSupplier(id)
{
    const request =
    new sql.Request();

    request.input(
    "SupplierID",
    sql.Int,
    id);

    await request.query(`
    DELETE
    FROM Suppliers
    WHERE SupplierID=@SupplierID
    `);
}

module.exports =
{
    getAllSuppliers,

    getSupplier,

    addSupplier,

    updateSupplier,

    deleteSupplier
};