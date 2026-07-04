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

async function getInventoryStats()
{
    const result =
    await sql.query(`
    SELECT

    COUNT(*) AS TotalProducts,

    ISNULL(SUM(Stock),0) AS TotalStock,

    SUM
    (
        CASE

        WHEN Stock<=MinimumStock
        AND Stock>0

        THEN 1

        ELSE 0

        END
    )
    AS LowStock,

    SUM
    (
        CASE

        WHEN Stock=0

        THEN 1

        ELSE 0

        END
    )
    AS OutOfStock

    FROM Products
    `);

    return result.recordset[0];
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
    const transaction =
    new sql.Transaction();

    try
    {
        await transaction.begin();

        const request =
        new sql.Request(transaction);

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

        SET Stock = Stock + @Quantity

        WHERE ProductID = @ProductID

        `);

        await request.query(`

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

        await transaction.commit();
    }
    catch(error)
    {
        await transaction.rollback();

        throw error;
    }
}

async function stockOut(product)
{
    const transaction =
    new sql.Transaction();

    try
    {
        await transaction.begin();

        const request =
        new sql.Request(transaction);

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

        const stockResult =
        await request.query(`
        SELECT Stock

        FROM Products

        WHERE ProductID=@ProductID
        `);

        if(stockResult.recordset.length===0)
        {
            throw new Error("Product not found.");
        }

        const currentStock =
        stockResult.recordset[0].Stock;

        if(currentStock<product.quantity)
        {
            throw new Error("Insufficient stock.");
        }

        await request.query(`
        UPDATE Products

        SET Stock=Stock-@Quantity

        WHERE ProductID=@ProductID
        `);

        await request.query(`
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

        await transaction.commit();
    }
    catch(error)
    {
        if(transaction._aborted===false)
        {
            await transaction.rollback();
        }

        throw error;
    }
}

module.exports =
{
    getInventory,
    getInventoryStats,
    getTransactions,
    stockIn,
    stockOut
};