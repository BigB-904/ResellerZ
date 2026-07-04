const sql =
require("mssql");

async function getInventory()
{
    const result =
    await sql.query(`
    SELECT

    ProductID,

    ProductName,

    SKU,

    Category,

    Stock,

    MinimumStock,

    PurchasePrice,

    SalePrice

    FROM Products

    ORDER BY ProductName
    `);

    return result.recordset;
}

async function getTransactions(productId)
{
    const request =
    new sql.Request();

    request.input(
    "ProductID",
    sql.Int,
    productId);

    const result =
    await request.query(`
    SELECT *

    FROM InventoryTransactions

    WHERE ProductID=@ProductID

    ORDER BY CreatedAt DESC
    `);

    return result.recordset;
}

async function stockIn(product)
{
    const request =
    new sql.Request();

    request.input(
    "ProductID",
    sql.Int,
    product.productId);

    request.input(
    "Quantity",
    sql.Int,
    product.quantity);

    request.input(
    "Notes",
    sql.NVarChar(255),
    product.notes);

    await request.query(`

    UPDATE Products

    SET

    Stock =
    Stock + @Quantity

    WHERE ProductID=@ProductID

    INSERT INTO InventoryTransactions
    (
    ProductID,
    TransactionType,
    Quantity,
    ReferenceType,
    Notes
    )

    VALUES
    (
    @ProductID,
    'IN',
    @Quantity,
    'Manual',
    @Notes
    )

    `);
}

async function stockOut(product)
{
    const request =
    new sql.Request();

    request.input(
    "ProductID",
    sql.Int,
    product.productId);

    request.input(
    "Quantity",
    sql.Int,
    product.quantity);

    request.input(
    "Notes",
    sql.NVarChar(255),
    product.notes);

    await request.query(`

    UPDATE Products

    SET

    Stock =
    Stock - @Quantity

    WHERE ProductID=@ProductID

    INSERT INTO InventoryTransactions
    (
    ProductID,
    TransactionType,
    Quantity,
    ReferenceType,
    Notes
    )

    VALUES
    (
    @ProductID,
    'OUT',
    @Quantity,
    'Manual',
    @Notes
    )

    `);
}

module.exports =
{
    getInventory,
    getTransactions,
    stockIn,
    stockOut
};