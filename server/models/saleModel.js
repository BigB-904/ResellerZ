const sql =
require("mssql");

const invoiceModel =
require("./invoiceModel");

async function createSale(sale)
{
    const transaction =
    new sql.Transaction();

    try
    {
        await transaction.begin();

        const request =
        new sql.Request(transaction);

        request.input("CustomerID", sql.Int, sale.customerId);
        request.input("Notes", sql.NVarChar(255), sale.notes);

        const saleResult =
        await request.query(`
            INSERT INTO Sales (CustomerID, Notes)
            OUTPUT INSERTED.SaleID
            VALUES (@CustomerID, @Notes)
        `);

        const saleId =
        saleResult.recordset[0].SaleID;

        let total = 0;

        for(let item of sale.items)
        {
            const itemRequest =
            new sql.Request(transaction);

            itemRequest.input("SaleID", sql.Int, saleId);
            itemRequest.input("ProductID", sql.Int, item.productId);
            itemRequest.input("Quantity", sql.Int, item.quantity);
            itemRequest.input("SalePrice", sql.Decimal(18,2), item.salePrice);

            const stockCheck =
            await itemRequest.query(`
                SELECT Stock
                FROM Products
                WHERE ProductID = @ProductID
            `);

            if(stockCheck.recordset.length === 0)
            {
                throw new Error("Product not found");
            }

            const currentStock =
            stockCheck.recordset[0].Stock;

            if(currentStock < item.quantity)
            {
                throw new Error("Insufficient stock for product ID " + item.productId);
            }

            await itemRequest.query(`
                INSERT INTO SaleItems
                (
                    SaleID,
                    ProductID,
                    Quantity,
                    SalePrice
                )
                VALUES
                (
                    @SaleID,
                    @ProductID,
                    @Quantity,
                    @SalePrice
                )
            `);

            await itemRequest.query(`
                UPDATE Products
                SET Stock = Stock - @Quantity
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
                    'OUT',
                    @Quantity,
                    'Sale',
                    'Stock reduced via sale'
                )
            `);

            total += item.quantity * item.salePrice;
        }

        await request.query(`
            UPDATE Sales
            SET TotalAmount = ${total}
            WHERE SaleID = ${saleId}
        `);

        // =========================
        // AUTO INVOICE CREATION
        // =========================

        const invoiceNumber =
        "INV-" + Date.now();

        const invoiceResult =
        await request.query(`
            INSERT INTO Invoices
            (
                SaleID,
                InvoiceNumber,
                TotalAmount
            )
            OUTPUT INSERTED.InvoiceID
            VALUES
            (
                ${saleId},
                '${invoiceNumber}',
                ${total}
            )
        `);

        const invoiceId =
        invoiceResult.recordset[0].InvoiceID;

        await transaction.commit();

        return {
            saleId,
            invoiceId
        };
    }
    catch(error)
    {
        await transaction.rollback();
        throw error;
    }
}

module.exports =
{
    createSale
};

module.exports =
{
    createSale
};