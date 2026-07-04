const tableBody =
document.getElementById("supplierTableBody");

const modal =
document.getElementById("supplierModal");

const searchBox =
document.getElementById("searchBox");

const addButton =
document.getElementById("addSupplierButton");

const saveButton =
document.getElementById("saveSupplier");

const closeButton =
document.getElementById("closeModal");

const confirmModal =
document.getElementById("confirmModal");

const confirmDeleteButton =
document.getElementById("confirmDelete");

const cancelDeleteButton =
document.getElementById("cancelDelete");

let editId = null;

let deleteId = null;

function openModal()
{
    modal.classList.add("show");
}

function closeModal()
{
    modal.classList.remove("show");

    editId = null;

    companyName.value = "";

    contactPerson.value = "";

    phone.value = "";

    email.value = "";

    address.value = "";

    city.value = "";
}

function showToast(message,type="success")
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
    },100);

    setTimeout(function()
    {
        toast.remove();
    },2500);
}

async function loadSuppliers()
{
    tableBody.innerHTML = "";

    const result =
    await getSuppliers();

    if(!result.success)
    {
        tableBody.innerHTML =
        `
        <tr>

        <td colspan="8">

        Unable to load suppliers.

        </td>

        </tr>
        `;

        return;
    }

    let suppliers =
    result.data;

    const keyword =
    searchBox.value
    .toLowerCase();

    if(keyword!="")
    {
        suppliers =
        suppliers.filter(function(supplier)
        {
            return(

            supplier.CompanyName
            .toLowerCase()
            .includes(keyword)

            ||

            (supplier.ContactPerson ?? "")
            .toLowerCase()
            .includes(keyword)

            ||

            (supplier.City ?? "")
            .toLowerCase()
            .includes(keyword)

            );
        });
    }

    updateStatistics(suppliers);

    if(suppliers.length===0)
    {
        tableBody.innerHTML =
        `
        <tr>

        <td colspan="8">

        No suppliers found.

        </td>

        </tr>
        `;

        return;
    }

    suppliers.forEach(function(supplier)
    {
        tableBody.innerHTML +=
        `
        <tr>

        <td>

        ${supplier.SupplierID}

        </td>

        <td>

        ${supplier.CompanyName}

        </td>

        <td>

        ${supplier.ContactPerson ?? ""}

        </td>

        <td>

        ${supplier.Phone ?? ""}

        </td>

        <td>

        ${supplier.Email ?? ""}

        </td>

        <td>

        ${supplier.City ?? ""}

        </td>

        <td>

        ₨ ${supplier.Balance}

        </td>

        <td>

        <button
        class="btn btn-primary btn-small"
        onclick="editSupplier(${supplier.SupplierID})">

        Edit

        </button>

        <button
        class="btn btn-small"
        onclick="removeSupplier(${supplier.SupplierID})">

        Delete

        </button>

        </td>

        </tr>
        `;
    });
}

function updateStatistics(suppliers)
{
    totalSuppliers.innerText =
    suppliers.length;

    let active = 0;

    let inactive = 0;

    let balance = 0;

    suppliers.forEach(function(supplier)
    {
        if(supplier.Status)
        {
            active++;
        }
        else
        {
            inactive++;
        }

        balance +=
        Number(supplier.Balance);
    });

    activeSuppliers.innerText =
    active;

    inactiveSuppliers.innerText =
    inactive;

    supplierBalance.innerText =
    "₨ " +
    balance.toLocaleString();
}

async function saveSupplier()
{
    const supplier =
    {
        companyName:
        companyName.value.trim(),

        contactPerson:
        contactPerson.value.trim(),

        phone:
        phone.value.trim(),

        email:
        email.value.trim(),

        address:
        address.value.trim(),

        city:
        city.value.trim()
    };

    if(supplier.companyName=="")
    {
        showToast(
        "Company name required.",
        "warning");

        return;
    }

    if(editId==null)
    {
        const result =
        await addSupplier(supplier);

        if(result.success)
        {
            showToast(
            "Supplier Added");

            closeModal();

            loadSuppliers();
        }
    }
    else
    {
        const result =
        await updateSupplier(
        editId,
        supplier);

        if(result.success)
        {
            showToast(
            "Supplier Updated");

            closeModal();

            loadSuppliers();
        }
    }
}

async function editSupplier(id)
{
    try
    {
        const result =
        await getSupplier(id);

        if(!result.success)
        {
            showToast(
            "Supplier not found.",
            "error");

            return;
        }

        const supplier =
        result.data;

        editId =
        supplier.SupplierID;

        companyName.value =
        supplier.CompanyName;

        contactPerson.value =
        supplier.ContactPerson ?? "";

        phone.value =
        supplier.Phone ?? "";

        email.value =
        supplier.Email ?? "";

        address.value =
        supplier.Address ?? "";

        city.value =
        supplier.City ?? "";

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

function removeSupplier(id)
{
    deleteId = id;

    confirmModal.classList.add("show");
}

confirmDeleteButton.addEventListener(
"click",
async function()
{
    try
    {
        const result =
        await deleteSupplier(deleteId);

        confirmModal.classList.remove("show");

        if(result.success)
        {
            showToast(
            "Supplier deleted successfully.",
            "success");

            loadSuppliers();
        }
        else
        {
            showToast(
            result.message,
            "error");
        }
    }
    catch(error)
    {
        console.error(error);

        confirmModal.classList.remove("show");

        showToast(
        "Server Error",
        "error");
    }
});

cancelDeleteButton.addEventListener(
"click",
function()
{
    confirmModal.classList.remove("show");
});

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
saveSupplier);

searchBox.addEventListener(
"input",
loadSuppliers);

document.addEventListener(
"DOMContentLoaded",
loadSuppliers);