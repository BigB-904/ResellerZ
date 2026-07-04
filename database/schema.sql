-- ============================================================
-- Reseller ERP System
-- Database Schema - Phase 1
-- Database: resellerDB
-- SQL Server
-- ============================================================

USE resellerDB;
GO

-- ============================================================
-- TABLE: Roles
-- ============================================================

CREATE TABLE Roles
(
    RoleID INT IDENTITY(1,1) PRIMARY KEY,

    RoleName NVARCHAR(50) NOT NULL UNIQUE,

    Description NVARCHAR(255),

    IsActive BIT NOT NULL
        CONSTRAINT DF_Roles_IsActive DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Roles_CreatedAt DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL
);
GO

-- ============================================================
-- TABLE: Users
-- ============================================================

CREATE TABLE Users
(
    UserID INT IDENTITY(1,1) PRIMARY KEY,

    RoleID INT NOT NULL,

    Username NVARCHAR(50) NOT NULL UNIQUE,

    PasswordHash NVARCHAR(255) NOT NULL,

    FirstName NVARCHAR(100) NOT NULL,

    LastName NVARCHAR(100) NOT NULL,

    Email NVARCHAR(255) NOT NULL UNIQUE,

    Phone NVARCHAR(20),

    ProfileImage NVARCHAR(255),

    IsActive BIT NOT NULL
        CONSTRAINT DF_Users_IsActive DEFAULT 1,

    LastLogin DATETIME2 NULL,

    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Users_CreatedAt DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL,

    CONSTRAINT FK_Users_Roles
        FOREIGN KEY (RoleID)
        REFERENCES Roles(RoleID)
);
GO

-- ============================================================
-- TABLE: Categories
-- ============================================================

CREATE TABLE Categories
(
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,

    CategoryName NVARCHAR(100) NOT NULL UNIQUE,

    Description NVARCHAR(255),

    IsActive BIT NOT NULL
        CONSTRAINT DF_Categories_IsActive DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Categories_CreatedAt DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL
);
GO

-- ============================================================
-- TABLE: Brands
-- ============================================================

CREATE TABLE Brands
(
    BrandID INT IDENTITY(1,1) PRIMARY KEY,

    BrandName NVARCHAR(100) NOT NULL UNIQUE,

    Country NVARCHAR(100),

    Website NVARCHAR(255),

    IsActive BIT NOT NULL
        CONSTRAINT DF_Brands_IsActive DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Brands_CreatedAt DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL
);
GO

-- ============================================================
-- TABLE: Units
-- ============================================================

CREATE TABLE Units
(
    UnitID INT IDENTITY(1,1) PRIMARY KEY,

    UnitName NVARCHAR(50) NOT NULL UNIQUE,

    ShortName NVARCHAR(20) NOT NULL UNIQUE
);
GO

-- ============================================================
-- TABLE: Warehouses
-- ============================================================

CREATE TABLE Warehouses
(
    WarehouseID INT IDENTITY(1,1) PRIMARY KEY,

    WarehouseName NVARCHAR(100) NOT NULL UNIQUE,

    Address NVARCHAR(255),

    City NVARCHAR(100),

    Country NVARCHAR(100),

    Phone NVARCHAR(20),

    ManagerName NVARCHAR(100),

    IsActive BIT NOT NULL
        CONSTRAINT DF_Warehouses_IsActive DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL
        CONSTRAINT DF_Warehouses_CreatedAt DEFAULT GETDATE(),

    UpdatedAt DATETIME2 NULL
);
GO

CREATE TABLE Customers
(
    CustomerID INT IDENTITY(1,1) PRIMARY KEY,

    FirstName NVARCHAR(100) NOT NULL,

    LastName NVARCHAR(100) NOT NULL,

    Phone NVARCHAR(20) NOT NULL,

    Email NVARCHAR(150) NULL,

    Address NVARCHAR(255) NULL,

    City NVARCHAR(100) NULL,

    Balance DECIMAL(12,2) NOT NULL DEFAULT 0,

    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

--CREATE TABLE Products
--(
--    ProductID INT IDENTITY(1,1) PRIMARY KEY,
--    Name NVARCHAR(150) NOT NULL,
--    SKU NVARCHAR(100) NULL,
--    Category NVARCHAR(100) NULL,
--    Brand NVARCHAR(100) NULL,
--    PurchasePrice DECIMAL(18,2) NOT NULL,
--    SalePrice DECIMAL(18,2) NOT NULL,
--    Stock INT NOT NULL DEFAULT 0,
--    Description NVARCHAR(255) NULL,
--    CreatedAt DATETIME DEFAULT GETDATE()
--);

IF OBJECT_ID('Products', 'U') IS NOT NULL
DROP TABLE Products;
GO

CREATE TABLE Products
(
    ProductID INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(150) NOT NULL,
    SKU NVARCHAR(50) UNIQUE NOT NULL,
    Barcode NVARCHAR(100),
    Category NVARCHAR(100),
    Brand NVARCHAR(100),
    PurchasePrice DECIMAL(18,2) NOT NULL,
    SalePrice DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    MinimumStock INT NOT NULL DEFAULT 0,
    Description NVARCHAR(500),
    Status BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);
GO

CREATE TABLE Suppliers
(
    SupplierID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName NVARCHAR(150) NOT NULL,
    ContactPerson NVARCHAR(100),
    Phone NVARCHAR(30),
    Email NVARCHAR(120),
    Address NVARCHAR(255),
    City NVARCHAR(80),
    Balance DECIMAL(18,2) NOT NULL DEFAULT 0,
    Status BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
);


CREATE TABLE InventoryTransactions
(
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID INT NOT NULL,
    TransactionType NVARCHAR(10) NOT NULL,
    Quantity INT NOT NULL,
    ReferenceType NVARCHAR(30),
    ReferenceID INT,
    Notes NVARCHAR(255),
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY(ProductID)
    REFERENCES Products(ProductID)
);

ALTER TABLE Products

ADD

Unit NVARCHAR(20) NOT NULL
DEFAULT 'PCS';

ALTER TABLE Products

ADD

IsActive BIT NOT NULL
DEFAULT 1;


CREATE TABLE Purchases
(
    PurchaseID INT IDENTITY(1,1) PRIMARY KEY,

    SupplierID INT NOT NULL,

    PurchaseDate DATETIME DEFAULT GETDATE(),

    TotalAmount DECIMAL(18,2) DEFAULT 0,

    Notes NVARCHAR(255),

    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE PurchaseItems
(
    PurchaseItemID INT IDENTITY(1,1) PRIMARY KEY,

    PurchaseID INT NOT NULL,

    ProductID INT NOT NULL,

    Quantity INT NOT NULL,

    PurchasePrice DECIMAL(18,2) NOT NULL,

    LineTotal AS (Quantity * PurchasePrice),

    FOREIGN KEY (PurchaseID) REFERENCES Purchases(PurchaseID),

    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Sales
(
    SaleID INT IDENTITY(1,1) PRIMARY KEY,

    CustomerID INT NOT NULL,

    SaleDate DATETIME DEFAULT GETDATE(),

    TotalAmount DECIMAL(18,2) DEFAULT 0,

    Notes NVARCHAR(255),

    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

CREATE TABLE SaleItems
(
    SaleItemID INT IDENTITY(1,1) PRIMARY KEY,

    SaleID INT NOT NULL,

    ProductID INT NOT NULL,

    Quantity INT NOT NULL,

    SalePrice DECIMAL(18,2) NOT NULL,

    LineTotal AS (Quantity * SalePrice),

    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID),

    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

CREATE TABLE Invoices
(
    InvoiceID INT IDENTITY(1,1) PRIMARY KEY,

    SaleID INT NOT NULL,

    InvoiceNumber NVARCHAR(50),

    InvoiceDate DATETIME DEFAULT GETDATE(),

    TotalAmount DECIMAL(18,2),

    FOREIGN KEY (SaleID) REFERENCES Sales(SaleID)
);

