USE resellerDB;
GO

------------------------------------------------------
-- Roles
------------------------------------------------------

--INSERT INTO Roles (RoleName, Description)
--VALUES
--('Administrator', 'Full access to the system'),
--('Manager', 'Business management'),
--('Salesperson', 'Sales and customer management'),
--('Inventory Staff', 'Inventory and warehouse management'),
--('Customer', 'Customer portal access');
--GO

--------------------------------------------------------
---- Categories
--------------------------------------------------------

--INSERT INTO Categories (CategoryName, Description)
--VALUES
--('Smartphones', 'Mobile Phones'),
--('Laptops', 'Laptop Computers'),
--('Tablets', 'Tablet Devices'),
--('Accessories', 'Phone Accessories'),
--('Wearables', 'Smart Watches'),
--('Gaming', 'Gaming Consoles');
--GO

--------------------------------------------------------
---- Brands
--------------------------------------------------------

--INSERT INTO Brands (BrandName, Country)
--VALUES
--('Apple', 'USA'),
--('Samsung', 'South Korea'),
--('Xiaomi', 'China'),
--('Google', 'USA'),
--('OnePlus', 'China'),
--('Oppo', 'China'),
--('Vivo', 'China'),
--('Nothing', 'United Kingdom');
--GO

--------------------------------------------------------
---- Units
--------------------------------------------------------

--INSERT INTO Units (UnitName, ShortName)
--VALUES
--('Piece', 'Pc'),
--('Box', 'Box'),
--('Pack', 'Pack'),
--('Dozen', 'Dz');
--GO

--------------------------------------------------------
---- Warehouses
--------------------------------------------------------

--INSERT INTO Warehouses
--(
--    WarehouseName,
--    Address,
--    City,
--    Country,
--    Phone,
--    ManagerName
--)
--VALUES
--(
--    'Main Warehouse',
--    'Head Office',
--    'Rawalpindi',
--    'Pakistan',
--    '0510000000',
--    'Administrator'
--);
--GO

--SELECT * FROM Roles;
--SELECT * FROM Categories;
--SELECT * FROM Brands;
--SELECT * FROM Units;
--SELECT * FROM Warehouses;

--SELECT
--    UserID,
--    Username,
--    FirstName,
--    LastName,
--    Email,
--    PasswordHash
--FROM Users;

--INSERT INTO Products
--(
--ProductName,
--SKU,
--Barcode,
--Category,
--Brand,
--PurchasePrice,
--SalePrice,
--Stock,
--MinimumStock,
--Description
--)

--VALUES
--(
--'Samsung S25 Ultra',

--'SAM001',

--'880123456789',

--'Mobile',

--'Samsung',

--220000,

--245000,

--10,

--2,

--'Demo Product'
--);

--INSERT INTO Suppliers
--(
--CompanyName,
--ContactPerson,
--Phone,
--Email,
--Address,
--City
--)

--VALUES
--(
--'Samsung Pakistan',

--'Ahmed Khan',

--'03001234567',

--'sales@samsung.com',

--'Blue Area',

--'Islamabad'
--);

--INSERT INTO InventoryTransactions
--(
--ProductID,
--TransactionType,
--Quantity,
--ReferenceType,
--Notes
--)

--VALUES
--(
--1,
--'IN',
--25,
--'Manual',
--'Initial Stock'
--);