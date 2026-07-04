async function loadInvoice()
{
    const urlParams =
    new URLSearchParams(window.location.search);

    const id =
    urlParams.get("id");

    if(!id)
    {
        alert("Invoice ID missing");
        return;
    }

    const response =
    await fetch("/api/invoices/" + id);

    const result =
    await response.json();

    if(!result.success)
    {
        alert("Failed to load invoice");
        return;
    }

    const data =
    result.data;

    document.getElementById("invoiceNumber").innerText =
    data.invoice.InvoiceNumber;

    document.getElementById("invoiceDate").innerText =
    new Date(data.invoice.InvoiceDate).toLocaleString();

    document.getElementById("saleId").innerText =
    "Sale ID: " + data.invoice.SaleID;

    document.getElementById("totalAmount").innerText =
    data.invoice.TotalAmount;

    const tbody =
    document.getElementById("invoiceItems");

    tbody.innerHTML = "";

    data.items.forEach(item =>
    {
        tbody.innerHTML += `
            <tr>

                <td>${item.ProductName}</td>
                <td>${item.Quantity}</td>
                <td>₨ ${item.SalePrice}</td>
                <td>₨ ${item.Quantity * item.SalePrice}</td>

            </tr>
        `;
    });
}

function printInvoice()
{
    window.print();
}

document.addEventListener("DOMContentLoaded", loadInvoice);