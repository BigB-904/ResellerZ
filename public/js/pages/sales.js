let sales = [];
let customers = [];
let products = [];
let saleItems = [];

document.addEventListener("DOMContentLoaded", async function ()
{
    registerEvents();

    await loadCustomers();
    await loadProducts();
    await loadSales();

    updateStats();
});

/* ---------------- Events ---------------- */

function registerEvents()
{
    document
    .getElementById("newSaleButton")
    .addEventListener("click", openSaleModal);

    document
    .getElementById("closeSaleModal")
    .addEventListener("click", closeSaleModal);

    document
    .getElementById("addSaleItemButton")
    .addEventListener("click", addSaleItem);

    document
    .getElementById("saveSaleButton")
    .addEventListener("click", saveSale);

    document
    .getElementById("searchBox")
    .addEventListener("input", searchSales);
}

/* ---------------- Load Data ---------------- */

async function loadCustomers()
{
    const res = await fetch("/api/customers");
    const result = await res.json();

    if(result.success)
    {
        customers = result.data;

        const select = document.getElementById("customerSelect");
        select.innerHTML = `<option value="">Select Customer</option>`;

        customers.forEach(c =>
        {
            select.innerHTML +=
            `<option value="${c.CustomerID}">
                ${c.CustomerName}
            </option>`;
        });
    }
}

async function loadProducts()
{
    const res = await fetch("/api/products");
    const result = await res.json();

    if(result.success)
    {
        products = result.data;
    }
}

async function loadSales()
{
    const res = await fetch("/api/sales");
    const result = await res.json();

    if(result.success)
    {
        sales = result.data;
        renderSales(sales);
    }
}

/* ---------------- Render ---------------- */

function renderSales(data)
{
    const tbody = document.getElementById("salesTableBody");
    tbody.innerHTML = "";

    data.forEach(sale =>
    {
        tbody.innerHTML +=
        `
        <tr>
            <td>${sale.SaleID}</td>
            <td>${new Date(sale.SaleDate).toLocaleDateString()}</td>
            <td>${sale.CustomerName}</td>
            <td>₨ ${Number(sale.TotalAmount).toFixed(2)}</td>
            <td>
                <button class="btn btn-primary" onclick="viewSale(${sale.SaleID})">
                    View
                </button>
            </td>
        </tr>
        `;
    });
}

/* ---------------- Sale Modal ---------------- */

function openSaleModal()
{
    saleItems = [];
    renderSaleItems();

    document.getElementById("saleModal").style.display = "block";
}

function closeSaleModal()
{
    document.getElementById("saleModal").style.display = "none";
}

/* ---------------- Items ---------------- */

function addSaleItem()
{
    saleItems.push({
        productId: 0,
        quantity: 1,
        salePrice: 0
    });

    renderSaleItems();
}

function renderSaleItems()
{
    const tbody = document.getElementById("saleItemsBody");
    tbody.innerHTML = "";

    saleItems.forEach((item, index) =>
    {
        let productOptions = "";

        products.forEach(p =>
        {
            productOptions +=
            `<option value="${p.ProductID}">
                ${p.ProductName}
            </option>`;
        });

        const total = item.quantity * item.salePrice;

        tbody.innerHTML +=
        `
        <tr>

            <td>
                <select onchange="updateItemProduct(${index}, this.value)">
                    <option value="">Select</option>
                    ${productOptions}
                </select>
            </td>

            <td>
                <input type="number" value="${item.quantity}" onchange="updateItemQty(${index}, this.value)">
            </td>

            <td>
                <input type="number" value="${item.salePrice}" onchange="updateItemPrice(${index}, this.value)">
            </td>

            <td>₨ ${total}</td>

            <td>
                <button class="btn" onclick="removeItem(${index})">X</button>
            </td>

        </tr>
        `;
    });

    updateTotal();
}

/* ---------------- Item Updates ---------------- */

function updateItemProduct(index, value)
{
    saleItems[index].productId = Number(value);
}

function updateItemQty(index, value)
{
    saleItems[index].quantity = Number(value);
    renderSaleItems();
}

function updateItemPrice(index, value)
{
    saleItems[index].salePrice = Number(value);
    renderSaleItems();
}

function removeItem(index)
{
    saleItems.splice(index, 1);
    renderSaleItems();
}

/* ---------------- Total ---------------- */

function updateTotal()
{
    let total = 0;

    saleItems.forEach(i =>
    {
        total += i.quantity * i.salePrice;
    });

    document.getElementById("saleGrandTotal").textContent =
    "₨ " + total.toFixed(2);
}

/* ---------------- Save Sale ---------------- */

async function saveSale()
{
    const customerId = document.getElementById("customerSelect").value;
    const notes = document.getElementById("saleNotes").value;

    const payload =
    {
        customerId: Number(customerId),
        notes,
        items: saleItems
    };

    const res = await fetch("/api/sales", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();

    alert(result.message);

    if(result.success)
    {
        closeSaleModal();
        await loadSales();
    }
}

/* ---------------- Search ---------------- */

function searchSales()
{
    const keyword = document.getElementById("searchBox").value.toLowerCase();

    const filtered = sales.filter(s =>
        s.CustomerName.toLowerCase().includes(keyword)
    );

    renderSales(filtered);
}

/* ---------------- View (placeholder) ---------------- */

function viewSale(id)
{
    alert("View Sale will be added next step.");
}

/* ---------------- Stats (placeholder) ---------------- */

function updateStats()
{
    document.getElementById("totalSales").textContent = sales.length;
}