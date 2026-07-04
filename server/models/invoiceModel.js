const sql =
require("mssql");

async function createInvoice(saleId)
{
    const transaction =
    new sql.Transaction();

    try
    {
        await transaction.begin();

        const request =
        new sql.Request(transaction);

        const saleData =
        await request.query(`
            SELECT *
            FROM Sales
            WHERE SaleID = ${saleId}
        `);

        if(saleData.recordset.length === 0)
        {
            throw new Error("Sale not found");
        }

        const items =
        await request.query(`
            SELECT *
            FROM SaleItems
            WHERE SaleID = ${saleId}
        `);

        const invoiceNumber =
        "INV-" +
        Date.now();

        const total =
        saleData.recordset[0].TotalAmount;

        const invoiceResult =
        await request.query(`
            INSERT INTO Invoices
            (
                SaleID,
                InvoiceNumber,
                TotalAmount
            )
            OUTPUT INSERTED.*
            VALUES
            (
                ${saleId},
                '${invoiceNumber}',
                ${total}
            )
        `);

        await transaction.commit();

        return invoiceResult.recordset[0];
    }
    catch(error)
    {
        await transaction.rollback();
        throw error;
    }
}

async function getInvoiceById(id)
{
    const request =
    new sql.Request();

    const invoice =
    await request.query(`
        SELECT *
        FROM Invoices
        WHERE InvoiceID = ${id}
    `);

    const items =
    await request.query(`
        SELECT si.*, p.ProductName
        FROM SaleItems si
        JOIN Products p ON si.ProductID = p.ProductID
        WHERE si.SaleID = (
            SELECT SaleID FROM Invoices WHERE InvoiceID = ${id}
        )
    `);

    return {
        invoice: invoice.recordset[0],
        items: items.recordset
    };
}

module.exports =
{
    createInvoice,
    getInvoiceById
};