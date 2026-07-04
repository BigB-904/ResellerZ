const tableBody =
document.getElementById("productTableBody");

const modal =
document.getElementById("productModal");

const searchBox =
document.getElementById("searchBox");

const addButton =
document.getElementById("addProductButton");

const saveButton =
document.getElementById("saveProduct");

const confirmModal =
document.getElementById("confirmModal");

const confirmDeleteButton =
document.getElementById("confirmDelete");

const cancelDeleteButton =
document.getElementById("cancelDelete");

let deleteId = null;
const closeButton =
document.getElementById("closeModal");

let editId = null;

function openModal()
{
    modal.classList.add("show");
}

function closeModal()
{
    modal.classList.remove("show");

    editId = null;

    productName.value = "";
    sku.value = "";
    barcode.value = "";
    category.value = "";
    brand.value = "";
    purchasePrice.value = "";
    salePrice.value = "";
    stock.value = "";
    minimumStock.value = "";
    description.value = "";
}

function showToast(message)
{
    const toast =
    document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(function()
    {
        toast.classList.add("show");
    },100);

    setTimeout(function()
    {
        toast.remove();
    },2500);
}function showToast(message,type="success")
{
    const toast =
    document.createElement("div");

    toast.className =
    "toast toast-" + type;

    toast.innerText =
    message;

    document.body.appendChild(toast);

    setTimeout(function()
    {
        toast.classList.add("show");
    },50);

    setTimeout(function()
    {
        toast.remove();
    },2500);
}

async function loadProducts()
{
    tableBody.innerHTML = "";

    const result =
    await getProducts();

    if(!result.success)
    {
        tableBody.innerHTML =
        `
        <tr>

        <td colspan="8">

        Unable to load products.

        </td>

        </tr>
        `;

        return;
    }

    let products = result.data;

    const query =
    searchBox.value.toLowerCase();

    if(query !== "")
    {
        products =
        products.filter(function(product)
        {
            return (

            product.ProductName
            .toLowerCase()
            .includes(query)

            ||

            product.SKU
            .toLowerCase()
            .includes(query)

            ||

            product.Brand
            .toLowerCase()
            .includes(query)

            );
        });
    }

    updateStatistics(products);

    if(products.length===0)
    {
        tableBody.innerHTML=
        `
        <tr>

        <td colspan="8">

        No products found.

        </td>

        </tr>
        `;

        return;
    }

    products.forEach(function(product)
    {
        tableBody.innerHTML +=
        `
        <tr>

        <td>${product.ProductID}</td>

        <td>${product.ProductName}</td>

        <td>${product.SKU}</td>

        <td>${product.Category ?? ""}</td>

        <td>${product.Brand ?? ""}</td>

        <td>₨ ${product.SalePrice}</td>

        <td>${product.Stock}</td>

        <td>

        <button
        class="btn btn-primary btn-small"
        onclick="editProduct(${product.ProductID})">

        Edit

        </button>

        <button
        class="btn btn-small"
        onclick="removeProduct(${product.ProductID})">

        Delete

        </button>

        </td>

        </tr>
        `;
    });

}

function updateStatistics(products)
{
    totalProducts.innerText =
    products.length;

    let low = 0;

    let out = 0;

    let inventory = 0;

    products.forEach(function(product)
    {
        if(product.Stock==0)
        out++;

        if(product.Stock<=product.MinimumStock)
        low++;

        inventory +=
        product.Stock *
        product.PurchasePrice;
    });

    lowStock.innerText =
    low;

    outOfStock.innerText =
    out;

    inventoryValue.innerText =
    "₨ " +
    inventory.toLocaleString();
}

async function saveProduct()
{
    const product =
    {
        productName:
        productName.value.trim(),

        sku:
        sku.value.trim(),

        barcode:
        barcode.value.trim(),

        category:
        category.value.trim(),

        brand:
        brand.value.trim(),

        purchasePrice:
        Number(purchasePrice.value),

        salePrice:
        Number(salePrice.value),

        stock:
        Number(stock.value),

        minimumStock:
        Number(minimumStock.value),

        description:
        description.value.trim()
    };

    if(product.productName=="")
    {
        showToast(
                "Product name is required.",
                "warning");
        return;
    }

    if(editId==null)
    {
        await addProduct(product);

        showToast("Product Added");
    }
    else
    {
        await updateProduct(editId,product);

        showToast("Product Updated");
    }

    closeModal();

    loadProducts();
}

async function editProduct(productId)
{
    try
    {
        const result =
        await getProduct(productId);

        if(!result.success)
        {
            alert("Unable to load product.");

            return;
        }

        const product =
        result.data;

        editId =
        product.ProductID;

        productName.value =
        product.ProductName;

        sku.value =
        product.SKU;

        barcode.value =
        product.Barcode ?? "";

        category.value =
        product.Category ?? "";

        brand.value =
        product.Brand ?? "";

        purchasePrice.value =
        product.PurchasePrice;

        salePrice.value =
        product.SalePrice;

        stock.value =
        product.Stock;

        minimumStock.value =
        product.MinimumStock;

        description.value =
        product.Description ?? "";

        openModal();
    }
    catch(error)
    {
        console.error(error);

        showToast(
            "Server Error",
            "error");
    }
}

// async function removeProduct(productId)
// {
//     deleteId = productId;

//     confirmModal.classList.add("show");
// }

async function removeProduct(productId)
{
    const confirmDelete =
    confirm("Delete this product?");

    if(!confirmDelete)
    {
        return;
    }

    try
    {
        const result =
        await deleteProduct(productId);

        if(result.success)
        {
            showToast("Product Deleted");

            loadProducts();
        }
        else
        {
            showToast(result.message, "error");
        }
    }
    catch(error)
    {
        console.error(error);

        alert("Server Error");
    }
}

addButton.addEventListener(
"click",
function()
{
    closeModal();

    openModal();
});

closeButton.addEventListener(
"click",
closeModal);

saveButton.addEventListener(
"click",
saveProduct);

searchBox.addEventListener(
"input",
loadProducts);

document.addEventListener(
"DOMContentLoaded",
loadProducts);

cancelDeleteButton.addEventListener(
"click",
function()
{
    confirmModal.classList.remove("show");
});

confirmDeleteButton.addEventListener(
"click",
async function()
{
    const result =
    await deleteProduct(deleteId);

    confirmModal.classList.remove("show");

    if(result.success)
    {
        showToast(
        "Product deleted successfully",
        "success");

        loadProducts();
    }
    else
    {
        showToast(
        "Unable to delete product",
        "error");
    }
});