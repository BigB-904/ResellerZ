let purchases = [];

let suppliers = [];

let products = [];

let purchaseItems = [];

/* ---------------- Page Load ---------------- */

document.addEventListener(
"DOMContentLoaded",
async function()
{
    registerEvents();

    await loadSuppliers();

    await loadProducts();

    await loadPurchases();

    updateStatistics();
});

/* ---------------- Events ---------------- */

function registerEvents()
{
    document
    .getElementById("newPurchaseButton")
    .addEventListener(
    "click",
    openPurchaseModal);

    document
    .getElementById("closePurchaseModal")
    .addEventListener(
    "click",
    closePurchaseModal);

    document
    .getElementById("searchBox")
    .addEventListener(
    "input",
    searchPurchases);

    document
    .getElementById("addItemButton")
    .addEventListener(
    "click",
    addItemRow);

    document
    .getElementById("savePurchaseButton")
    .addEventListener(
    "click",
    savePurchase);

    document
    .getElementById("closeViewPurchaseModal")
    .addEventListener(
    "click",
    function()
    {
        document
        .getElementById("viewPurchaseModal")
        .style.display = "none";
    });
}

/* ---------------- Purchases ---------------- */

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
            purchases =
            result.data;

            renderPurchases(
            purchases);

            updateStatistics();
        }
    }
    catch(error)
    {
        console.error(error);

        alert("Unable to load purchases.");
    }
}

/* ---------------- Suppliers ---------------- */

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
            suppliers =
            result.data;
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

/* ---------------- Products ---------------- */

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
            products =
            result.data;
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

/* ---------------- Render Purchase List ---------------- */

function renderPurchases(data)
{
    const tbody =
    document.getElementById(
    "purchaseTableBody");

    tbody.innerHTML = "";

    data.forEach(purchase =>
    {
        tbody.innerHTML +=
        `
        <tr>

            <td>${purchase.PurchaseID}</td>

            <td>
            ${
                new Date(
                purchase.PurchaseDate)
                .toLocaleDateString()
            }
            </td>

            <td>${purchase.SupplierName}</td>

            <td>
            ₨ ${Number(
            purchase.TotalAmount).toFixed(2)}
            </td>

            <td>

                <button
                class="btn btn-primary"
                onclick="viewPurchase(${purchase.PurchaseID})">

                    View

                </button>

            </td>

        </tr>
        `;
    });
}

async function viewPurchase(purchaseId)
{
    try
    {
        const response =
        await fetch(
        "/api/purchases/" +
        purchaseId);

        const result =
        await response.json();

        if(!result.success)
        {
            alert(result.message);

            return;
        }

        const tbody =
        document.getElementById(
        "purchaseDetailsBody");

        tbody.innerHTML = "";

        let grandTotal = 0;

        result.data.forEach(item =>
        {
            grandTotal +=
            Number(item.Total);

            tbody.innerHTML +=
            `
            <tr>

                <td>${item.ProductName}</td>

                <td>${item.SKU}</td>

                <td>${item.Quantity}</td>

                <td>₨ ${Number(item.PurchasePrice).toFixed(2)}</td>

                <td>₨ ${Number(item.Total).toFixed(2)}</td>

            </tr>
            `;
        });

        // document
        // .getElementById("viewPurchaseID")
        // .textContent =
        // purchaseId;

        console.log("viewPurchaseID:", document.getElementById("viewPurchaseID"));
        console.log("viewSupplier:", document.getElementById("viewSupplier"));
        console.log("viewPurchaseDate:", document.getElementById("viewPurchaseDate"));
        console.log("purchaseGrandTotal:", document.getElementById("purchaseGrandTotal"));
        console.log("purchaseGrandTotalBottom:", document.getElementById("purchaseGrandTotalBottom"));

        document
        .getElementById("viewPurchaseID")
        .textContent =
        purchaseId;

        const purchase =
        purchases.find(p =>
        p.PurchaseID == purchaseId);

        if(purchase)
        {
            document
            .getElementById("viewSupplier")
            .textContent =
            purchase.SupplierName;

            document
            .getElementById("viewPurchaseDate")
            .textContent =
            new Date(
            purchase.PurchaseDate)
            .toLocaleString();
        }

        document
        .getElementById("purchaseGrandTotal")
        .textContent =
        "₨ " +
        grandTotal.toFixed(2);

        document
        .getElementById("purchaseGrandTotalBottom")
        .textContent =
        "₨ " +
        grandTotal.toFixed(2);

        document
        .getElementById("viewPurchaseModal")
        .style.display =
        "block";
    }
    catch(error)
        {
            console.error(error);

            alert(error.message);
        }
}

/* ---------------- Statistics ---------------- */

function updateStatistics()
{
    document
    .getElementById("totalPurchases")
    .textContent =
    purchases.length;

    let today = 0;

    let total = 0;

    const current =
    new Date();

    purchases.forEach(purchase =>
    {
        total +=
        Number(
        purchase.TotalAmount);

        const date =
        new Date(
        purchase.PurchaseDate);

        if(date.toDateString() ==
        current.toDateString())
        {
            today++;
        }
    });

    document
    .getElementById("todayPurchases")
    .textContent =
    today;

    document
    .getElementById("purchaseAmount")
    .textContent =
    "₨ " +
    total.toFixed(2);
}

/* ---------------- Search ---------------- */

function searchPurchases()
{
    const keyword =
    document
    .getElementById("searchBox")
    .value
    .toLowerCase();

    const filtered =
    purchases.filter(purchase =>
        purchase.SupplierName
        .toLowerCase()
        .includes(keyword)
    );

    renderPurchases(filtered);
}

/* ---------------- Purchase Modal ---------------- */

function openPurchaseModal()
{
    purchaseItems = [];

    document
    .getElementById("supplierSelect")
    .innerHTML =
    '<option value="">Select Supplier</option>';

    suppliers.forEach(supplier =>
    {
        document
        .getElementById("supplierSelect")
        .innerHTML +=
        `
        <option value="${supplier.SupplierID}">
            ${supplier.CompanyName}
        </option>
        `;
    });

    document
    .getElementById("purchaseNotes")
    .value = "";

    document
    .getElementById("purchaseItemsBody")
    .innerHTML = "";

    document
    .getElementById("grandTotal")
    .textContent = "₨ 0.00";

    addItemRow();

    document
    .getElementById("purchaseModal")
    .style.display = "block";
}

function closePurchaseModal()
{
    document
    .getElementById("purchaseModal")
    .style.display = "none";
}

/* ---------------- Purchase Items ---------------- */

function addItemRow()
{
    purchaseItems.push(
    {
        productId:0,
        quantity:1,
        purchasePrice:0
    });

    renderPurchaseItems();
}

function removeItem(index)
{
    purchaseItems.splice(index,1);

    if(purchaseItems.length==0)
    {
        addItemRow();
        return;
    }

    renderPurchaseItems();
}

function renderPurchaseItems()
{
    const tbody =
    document.getElementById(
    "purchaseItemsBody");

    tbody.innerHTML = "";

    purchaseItems.forEach((item,index)=>
    {
        let options =
        '<option value="">Select Product</option>';

        products.forEach(product =>
        {
            options +=
            `
            <option
            value="${product.ProductID}"
            ${item.productId==product.ProductID?"selected":""}>

                ${product.ProductName}

            </option>
            `;
        });

        tbody.innerHTML +=
        `
        <tr>

            <td>

                <select
                onchange="changeProduct(${index},this.value)"
                class="input">

                    ${options}

                </select>

            </td>

            <td>

                <input
                class="input"
                type="number"
                min="1"
                value="${item.quantity}"
                onchange="changeQuantity(${index},this.value)">

            </td>

            <td>

                <input
                class="input"
                type="number"
                min="0"
                value="${item.purchasePrice}"
                onchange="changePrice(${index},this.value)">

            </td>

            <td>

                ₨
                <span id="itemTotal${index}">

                    0.00

                </span>

            </td>

            <td>

                <button
                class="btn-remove"
                onclick="removeItem(${index})">

                    Remove

                </button>

            </td>

        </tr>
        `;
    });

    calculateGrandTotal();
}

/* ---------------- Item Changes ---------------- */

function changeProduct(index,value)
{
    purchaseItems[index].productId =
    Number(value);

    const product =
    products.find(product =>
    product.ProductID==
    Number(value));

    if(product)
    {
        purchaseItems[index].purchasePrice =
        Number(product.PurchasePrice);
    }

    renderPurchaseItems();
}

function changeQuantity(index,value)
{
    purchaseItems[index].quantity =
    Number(value);

    renderPurchaseItems();
}

function changePrice(index,value)
{
    purchaseItems[index].purchasePrice =
    Number(value);

    renderPurchaseItems();
}

/* ---------------- Grand Total ---------------- */

function calculateGrandTotal()
{
    let total = 0;

    purchaseItems.forEach((item,index)=>
    {
        const rowTotal =
        item.quantity *
        item.purchasePrice;

        total += rowTotal;

        const span =
        document.getElementById(
        "itemTotal"+index);

        if(span)
        {
            span.textContent =
            rowTotal.toFixed(2);
        }
    });

    document
    .getElementById("grandTotal")
    .textContent =
    "₨ " +
    total.toFixed(2);
}

/* ---------------- Save Purchase ---------------- */

async function savePurchase()
{
    const supplierId =
    Number(
    document.getElementById(
    "supplierSelect").value);

    const notes =
    document.getElementById(
    "purchaseNotes").value.trim();

    if(supplierId==0)
    {
        alert("Please select a supplier.");

        return;
    }

    if(purchaseItems.length==0)
    {
        alert("Please add at least one product.");

        return;
    }

    for(const item of purchaseItems)
    {
        if(item.productId==0)
        {
            alert("Please select a product.");

            return;
        }

        if(item.quantity<=0)
        {
            alert("Quantity must be greater than zero.");

            return;
        }

        if(item.purchasePrice<=0)
        {
            alert("Purchase price must be greater than zero.");

            return;
        }
    }

    try
    {
        const response =
        await fetch(
        "/api/purchases",
        {
            method:"POST",

            headers:
            {
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(
            {
                supplierId:
                supplierId,

                notes:
                notes,

                items:
                purchaseItems
            })
        });

        const result =
        await response.json();

        alert(result.message);

        if(result.success)
        {
            closePurchaseModal();

            await loadPurchases();

            purchaseItems=[];

            document
            .getElementById(
            "purchaseItemsBody")
            .innerHTML="";

            document
            .getElementById(
            "grandTotal")
            .textContent=
            "₨ 0.00";
        }
    }
    catch(error)
    {
        console.error(error);

        alert("Unable to save purchase.");
    }
}

document
.getElementById("closeViewPurchaseModal")
.onclick =
function()
{
    document
    .getElementById("viewPurchaseModal")
    .style.display =
    "none";
};

document
.getElementById("printPurchaseButton")
.onclick =
function()
{
    window.print();
};