// ==============================
// DOM ELEMENTS
// ==============================

const purchaseTableBody =
document.getElementById("purchaseTableBody");

const supplierSelect =
document.getElementById("supplierSelect");

const productSelect =
document.getElementById("productSelect");

const quantityInput =
document.getElementById("quantity");

const purchasePriceInput =
document.getElementById("purchasePrice");

const purchaseNotes =
document.getElementById("purchaseNotes");

const purchaseModal =
document.getElementById("purchaseModal");

const purchaseItemsBody =
document.getElementById("purchaseItemsBody");

const grandTotal =
document.getElementById("grandTotal");

const searchBox =
document.getElementById("searchBox");

const newPurchaseButton =
document.getElementById("newPurchaseButton");

const closePurchaseModal =
document.getElementById("closePurchaseModal");

// ==============================
// GLOBAL DATA
// ==============================

let suppliers = [];

let products = [];

let purchaseItems = [];

let purchases = [];

// ==============================
// LOAD PURCHASE HISTORY
// ==============================

async function loadPurchases()
{
    try
    {
        const response =
        await fetch("/api/purchases");

        const result =
        await response.json();

        if(result.success)
        {
            purchases = result.data;

            renderPurchases(result.data);
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

// ==============================
// RENDER PURCHASE TABLE
// ==============================

function renderPurchases(data)
{
    purchaseTableBody.innerHTML = "";

    data.forEach(function(purchase)
    {
        purchaseTableBody.innerHTML +=
        `
        <tr>

            <td>${purchase.PurchaseID}</td>

            <td>
                ${new Date(purchase.PurchaseDate).toLocaleDateString()}
            </td>

            <td>
                ${purchase.SupplierName}
            </td>

            <td>
                ₨ ${purchase.TotalAmount}
            </td>

            <td>

                <button class="btn">

                    View

                </button>

            </td>

        </tr>
        `;
    });
}

// ==============================
// LOAD SUPPLIERS
// ==============================

async function loadSuppliers()
{
    try
    {
        const response =
        await fetch("/api/suppliers");

        const result =
        await response.json();

        if(result.success)
        {
            suppliers = result.data;

            supplierSelect.innerHTML = "";

            suppliers.forEach(function(supplier)
            {
                supplierSelect.innerHTML +=
                `
                <option
                value="${supplier.SupplierID}">

                    ${supplier.CompanyName}

                </option>
                `;
            });
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

// ==============================
// LOAD PRODUCTS
// ==============================

async function loadProducts()
{
    try
    {
        const response =
        await fetch("/api/products");

        const result =
        await response.json();

        if(result.success)
        {
            products = result.data;

            productSelect.innerHTML = "";

            products.forEach(function(product)
            {
                productSelect.innerHTML +=
                `
                <option
                value="${product.ProductID}">

                    ${product.ProductName}

                </option>
                `;
            });
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

// ==============================
// SEARCH
// ==============================

searchBox.addEventListener(
"keyup",
function()
{
    const value =
    searchBox.value.toLowerCase();

    const filtered =
    purchases.filter(function(item)
    {
        return (
            item.SupplierName
            .toLowerCase()
            .includes(value)
        );
    });

    renderPurchases(filtered);
});

// ==============================
// MODAL
// ==============================

newPurchaseButton.onclick =
function()
{
    purchaseModal.style.display = "block";
};

closePurchaseModal.onclick =
function()
{
    purchaseModal.style.display = "none";
};

window.onclick =
function(event)
{
    if(event.target === purchaseModal)
    {
        purchaseModal.style.display = "none";
    }
};

// ==============================
// INITIALIZE PAGE
// ==============================

loadPurchases();

loadSuppliers();

loadProducts();