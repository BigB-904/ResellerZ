const sql = require("mssql");

async function getAllProducts() {
    const result = await sql.query(`
        SELECT *
        FROM Products
        ORDER BY ProductID DESC
    `);

    return result.recordset;
}

async function getProductById(productId) {
    const request = new sql.Request();

    request.input("ProductID", sql.Int, productId);

    const result = await request.query(`
        SELECT *
        FROM Products
        WHERE ProductID=@ProductID
    `);

    return result.recordset[0];
}

async function addProduct(product) {
    const request = new sql.Request();

    request.input("ProductName", sql.NVarChar(150), product.productName);

    request.input("SKU", sql.NVarChar(50), product.sku);

    request.input("Barcode", sql.NVarChar(100), product.barcode);

    request.input("Category", sql.NVarChar(100), product.category);

    request.input("Brand", sql.NVarChar(100), product.brand);

    request.input("PurchasePrice", sql.Decimal(18, 2), product.purchasePrice);

    request.input("SalePrice", sql.Decimal(18, 2), product.salePrice);

    request.input("Stock", sql.Int, product.stock);

    request.input("MinimumStock", sql.Int, product.minimumStock);

    request.input("Description", sql.NVarChar(500), product.description);

    await request.query(`
    INSERT INTO Products
    (
        ProductName,
        SKU,
        Barcode,
        Category,
        Brand,
        PurchasePrice,
        SalePrice,
        Stock,
        MinimumStock,
        Description
    )

    VALUES
    (
        @ProductName,
        @SKU,
        @Barcode,
        @Category,
        @Brand,
        @PurchasePrice,
        @SalePrice,
        @Stock,
        @MinimumStock,
        @Description
    )
    `);
}

async function updateProduct(id, product) {
    const request = new sql.Request();

    request.input("ProductID", sql.Int, id);

    request.input("ProductName", sql.NVarChar(150), product.productName);

    request.input("SKU", sql.NVarChar(50), product.sku);

    request.input("Barcode", sql.NVarChar(100), product.barcode);

    request.input("Category", sql.NVarChar(100), product.category);

    request.input("Brand", sql.NVarChar(100), product.brand);

    request.input("PurchasePrice", sql.Decimal(18, 2), product.purchasePrice);

    request.input("SalePrice", sql.Decimal(18, 2), product.salePrice);

    request.input("Stock", sql.Int, product.stock);

    request.input("MinimumStock", sql.Int, product.minimumStock);

    request.input("Description", sql.NVarChar(500), product.description);

    await request.query(`
    UPDATE Products

    SET
    ProductName=@ProductName,
    SKU=@SKU,
    Barcode=@Barcode,
    Category=@Category,
    Brand=@Brand,
    PurchasePrice=@PurchasePrice,
    SalePrice=@SalePrice,
    Stock=@Stock,
    MinimumStock=@MinimumStock,
    Description=@Description,
    UpdatedAt=GETDATE()
    WHERE ProductID=@ProductID
    `);
}

async function deleteProduct(id) {
    const request = new sql.Request();

    request.input("ProductID", sql.Int, id);

    await request.query(`
    DELETE FROM Products
    WHERE ProductID=@ProductID
    `);
}

module.exports =
{
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};