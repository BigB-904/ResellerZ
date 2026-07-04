const API_BASE = "http://localhost:3000/api";

/* ---------------- Authentication ---------------- */

async function apiLogin(username, password)
{
    const response = await fetch(API_BASE + "/auth/login",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
        {
            username,
            password
        })
    });

    return await response.json();
}

/* ---------------- Customers ---------------- */

async function getCustomers()
{
    const response = await fetch(API_BASE + "/customers");

    return await response.json();
}

async function addCustomer(customer)
{
    const response = await fetch(API_BASE + "/customers",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(customer)
    });

    return await response.json();
}

async function deleteCustomer(customerId)
{
    const response = await fetch(API_BASE + "/customers/" + customerId,
    {
        method:"DELETE"
    });

    return await response.json();
}

async function updateCustomer(id, data)
{
    const res = await fetch(API_BASE + "/customers/" + id,
    {
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    });

    return res.json();
}

/* ---------------- Products ---------------- */

async function getProducts()
{
    const response = await fetch(API_BASE + "/products");

    return await response.json();
}

async function getProduct(productId)
{
    const response = await fetch(API_BASE + "/products/" + productId);

    return await response.json();
}

async function addProduct(product)
{
    const response = await fetch(API_BASE + "/products",
    {
        method: "POST",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)
    });

    return await response.json();
}

async function updateProduct(productId, product)
{
    const response = await fetch(API_BASE + "/products/" + productId,
    {
        method: "PUT",

        headers:
        {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)
    });

    return await response.json();
}

async function deleteProduct(productId)
{
    const response = await fetch(API_BASE + "/products/" + productId,
    {
        method: "DELETE"
    });

    return await response.json();
}

/* ---------- Suppliers ---------- */

async function getSuppliers()
{
    const response =
    await fetch(
    API_BASE +
    "/suppliers");

    return await response.json();
}

async function getSupplier(id)
{
    const response =
    await fetch(
    API_BASE +
    "/suppliers/" +
    id);

    return await response.json();
}

async function addSupplier(supplier)
{
    const response =
    await fetch(
    API_BASE +
    "/suppliers",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(supplier)
    });

    return await response.json();
}

async function updateSupplier(id,supplier)
{
    const response =
    await fetch(
    API_BASE +
    "/suppliers/" +
    id,
    {
        method:"PUT",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(supplier)
    });

    return await response.json();
}

async function deleteSupplier(id)
{
    const response =
    await fetch(
    API_BASE +
    "/suppliers/" +
    id,
    {
        method:"DELETE"
    });

    return await response.json();
}

/* ---------- Inventory ---------- */

async function getInventory()
{
    const response =
    await fetch(
    API_BASE +
    "/inventory");

    return await response.json();
}

async function getInventoryTransactions(id)
{
    const response =
    await fetch(
    API_BASE +
    "/inventory/transactions/" +
    id);

    return await response.json();
}

async function stockIn(product)
{
    const response =
    await fetch(
    API_BASE +
    "/inventory/stockin",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(product)
    });

    return await response.json();
}

async function stockOut(product)
{
    const response =
    await fetch(
    API_BASE +
    "/inventory/stockout",
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:
        JSON.stringify(product)
    });

    return await response.json();
}

