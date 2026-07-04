let inventory =
[];

let selectedProductId =
0;

let transactionType =
"";

document.addEventListener(
"DOMContentLoaded",
function()
{
    loadInventory();

    loadInventoryStats();

    document
    .getElementById("searchBox")
    .addEventListener(
    "input",
    searchInventory);
});

async function loadInventory()
{
    try
    {
        const response =
        await fetch("/api/inventory");

        const result =
        await response.json();

        if(result.success)
        {
            inventory =
            result.data;

            renderInventory(
            inventory);
        }
    }
    catch(error)
    {
        console.error(error);

        alert("Unable to load inventory.");
    }
}

async function loadInventoryStats()
{
    try
    {
        const response =
        await fetch("/api/inventory/stats");

        const result =
        await response.json();

        if(result.success)
        {
            document.getElementById("totalProducts").textContent =
            result.data.TotalProducts;

            document.getElementById("totalStock").textContent =
            result.data.TotalStock;

            document.getElementById("lowStock").textContent =
            result.data.LowStock;

            document.getElementById("outOfStock").textContent =
            result.data.OutOfStock;
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

function renderInventory(data)
{
    const tbody =
    document.getElementById("inventoryTableBody");

    tbody.innerHTML =
    "";

    data.forEach(product =>
    {
        let status =
        "<span class='status in-stock'>IS</span>";

        if(product.Stock==0)
        {
            status =
            "<span class='status out-stock'>OS</span>";
        }

        else if(product.Stock<=product.MinimumStock)
        {
            status =
            "<span class='status low-stock'>Low Stock</span>";
        }

        tbody.innerHTML +=
        `
        <tr>

            <td>${product.ProductID}</td>

            <td>${product.ProductName}</td>

            <td>${product.SKU}</td>

            <td>${product.Category}</td>

            <td>${product.Stock}</td>

            <td>${product.MinimumStock}</td>

            <td>${status}</td>

            <td>₨ ${product.PurchasePrice}</td>

            <td>₨ ${product.SalePrice}</td>

            <td>

                <button
                class="btn"
                onclick="viewHistory(${product.ProductID})">

                    History

                </button>

                <button
                class="btn btn-primary"
                onclick="openStockIn(${product.ProductID})">

                    Stock In

                </button>

                <button
                class="btn btn-danger"
                onclick="openStockOut(${product.ProductID})">

                    Stock Out

                </button>

            </td>

        </tr>
        `;
    });
}
function searchInventory()
{
    const keyword =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase();

    const filtered =
    inventory.filter(product =>
    product.ProductName.toLowerCase().includes(keyword)
    ||
    product.SKU.toLowerCase().includes(keyword)
    ||
    product.Category.toLowerCase().includes(keyword)
    );

    renderInventory(filtered);
}

async function viewHistory(productId)
{
    try
    {
        const response =
        await fetch(
        "/api/inventory/transactions/" +
        productId);

        const result =
        await response.json();

        if(!result.success)
        {
            alert("Unable to load history.");

            return;
        }

        const tbody =
        document.getElementById(
        "historyTableBody");

        tbody.innerHTML =
        "";

        result.data.forEach(transaction =>
        {
            const date =
            new Date(
            transaction.CreatedAt);

            tbody.innerHTML +=
            `
            <tr>

                <td>

                    ${date.toLocaleString()}

                </td>

                <td>

                    ${transaction.TransactionType}

                </td>

                <td>

                    ${transaction.Quantity}

                </td>

                <td>

                    ${transaction.ReferenceType ?? ""}

                </td>

                <td>

                    ${transaction.Notes ?? ""}

                </td>

            </tr>
            `;
        });

        document
        .getElementById("historyModal")
        .style.display =
        "block";
    }
    catch(error)
    {
        console.error(error);

        alert("Unable to load history.");
    }
}

function getProduct(productId)
{
    return inventory.find(product =>
    product.ProductID==productId);
}

function openStockIn(productId)
{
    selectedProductId =
    productId;

    transactionType =
    "stockin";

    const product =
    getProduct(productId);

    document
    .getElementById("modalTitle")
    .textContent =
    "Stock In";

    document
    .getElementById("modalProductName")
    .textContent =
    product.ProductName;

    document
    .getElementById("modalSKU")
    .textContent =
    product.SKU;

    document
    .getElementById("modalCurrentStock")
    .textContent =
    product.Stock;

    document
    .getElementById("quantity")
    .value =
    "";

    document
    .getElementById("notes")
    .value =
    "";

    document
    .getElementById("stockModal")
    .style.display =
    "block";
}

function openStockOut(productId)
{
    selectedProductId =
    productId;

    transactionType =
    "stockout";

    const product =
    getProduct(productId);

    document
    .getElementById("modalTitle")
    .textContent =
    "Stock Out";

    document
    .getElementById("modalProductName")
    .textContent =
    product.ProductName;

    document
    .getElementById("modalSKU")
    .textContent =
    product.SKU;

    document
    .getElementById("modalCurrentStock")
    .textContent =
    product.Stock;

    document
    .getElementById("quantity")
    .value =
    "";

    document
    .getElementById("notes")
    .value =
    "";

    document
    .getElementById("stockModal")
    .style.display =
    "block";
}

// function openStockIn(productId)
// {
//     alert(
//     "Stock In for Product ID: "
//     + productId);
// }

// function openStockOut(productId)
// {
//     alert(
//     "Stock Out for Product ID: "
//     + productId);
// }

document
.getElementById("closeStockModal")
.onclick =
function()
{
    document
    .getElementById("stockModal")
    .style.display =
    "none";
};

document
.getElementById("saveStock")
.onclick =
async function()
{
    const quantity =
    Number(
    document.getElementById("quantity").value);

    const notes =
    document.getElementById("notes").value;

    if(quantity<=0)
    {
        alert("Please enter a valid quantity.");

        return;
    }

    const response =
    await fetch(
    "/api/inventory/" +
    transactionType,
    {
        method:"POST",

        headers:
        {
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify(
        {
            productId:selectedProductId,
            quantity:quantity,
            notes:notes
        })
    });

    const result =
    await response.json();

    alert(result.message);

    if(result.success)
    {
        document
        .getElementById("stockModal")
        .style.display =
        "none";

        await loadInventory();

        await loadInventoryStats();
    }
};

document
.getElementById("closeHistoryModal")
.onclick =
function()
{
    document
    .getElementById("historyModal")
    .style.display =
    "none";
};