const sql =
require("mssql");

/* ---------------- CREATE PURCHASE ---------------- */

async function createPurchase(purchase)
{
    const transaction =
    new sql.Transaction();

    try
    {
        await transaction.begin();

        const request =
        new sql.Request(transaction);

        request.input("SupplierID", sql.Int, purchase.supplierId);
        request.input("Notes", sql.NVarChar(255), purchase.notes);

        const purchaseResult =
        await request.query(`
            INSERT INTO Purchases (SupplierID, Notes)
            OUTPUT INSERTED.PurchaseID
            VALUES (@SupplierID, @Notes)
        `);

        const purchaseId =
        purchaseResult.recordset[0].PurchaseID;

        let total = 0;

        for(let item of purchase.items)
        {
            const itemRequest =
            new sql.Request(transaction);

            itemRequest.input("PurchaseID", sql.Int, purchaseId);
            itemRequest.input("ProductID", sql.Int, item.productId);
            itemRequest.input("Quantity", sql.Int, item.quantity);
            itemRequest.input("PurchasePrice", sql.Decimal(18,2), item.purchasePrice);

            await itemRequest.query(`
                INSERT INTO PurchaseItems
                (
                    PurchaseID,
                    ProductID,
                    Quantity,
                    PurchasePrice
                )
                VALUES
                (
                    @PurchaseID,
                    @ProductID,
                    @Quantity,
                    @PurchasePrice
                )
            `);

            await itemRequest.query(`
                UPDATE Products
                SET Stock = Stock + @Quantity
                WHERE ProductID = @ProductID
            `);

            await itemRequest.query(`
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
                    'Purchase',
                    'Stock added via purchase'
                )
            `);

            total += item.quantity * item.purchasePrice;
        }

        await request.query(`
            UPDATE Purchases
            SET TotalAmount = ${total}
            WHERE PurchaseID = ${purchaseId}
        `);

        await transaction.commit();

        return purchaseId;
    }
    catch(error)
    {
        await transaction.rollback();
        throw error;
    }
}

async function getPurchases()
{
    const result =
    await sql.query(`
        SELECT

            p.PurchaseID,

            p.PurchaseDate,

            s.CompanyName AS SupplierName,

            p.TotalAmount,

            p.Notes

        FROM Purchases p

        INNER JOIN Suppliers s

        ON p.SupplierID = s.SupplierID

        ORDER BY p.PurchaseDate DESC
    `);

    return result.recordset;
}

async function getPurchaseDetails(purchaseId)
{
    const request =
    new sql.Request();

    request.input(
    "PurchaseID",
    sql.Int,
    purchaseId);

    const result =
    await request.query(`
        SELECT

            pi.PurchaseItemID,

            p.ProductName,

            p.SKU,

            pi.Quantity,

            pi.PurchasePrice,

            (pi.Quantity * pi.PurchasePrice)
            AS Total

        FROM PurchaseItems pi

        INNER JOIN Products p

        ON pi.ProductID=p.ProductID

        WHERE pi.PurchaseID=@PurchaseID

        ORDER BY p.ProductName
    `);

    return result.recordset;
}

module.exports =
{
    getPurchases,
    createPurchase,
    getPurchaseDetails
};