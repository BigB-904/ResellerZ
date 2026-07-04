const tableBody = document.getElementById("customerTableBody");

const modal = document.getElementById("customerModal");

const addCustomerButton = document.getElementById("addCustomerButton");

const closeModalButton = document.getElementById("closeModal");

const saveCustomerButton = document.getElementById("saveCustomer");

const searchBox = document.getElementById("searchBox");

let editId = null;

/* ---------------- UI HELPERS ---------------- */

function showToast(message, type = "success")
{
    const toast = document.createElement("div");

    toast.innerText = message;

    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "8px";
    toast.style.color = "white";
    toast.style.fontSize = "14px";
    toast.style.zIndex = "9999";
    toast.style.background = type === "success" ? "#16a34a" : "#dc2626";

    document.body.appendChild(toast);

    setTimeout(() =>
    {
        toast.remove();
    }, 2000);
}

/* ---------------- MODAL ---------------- */

function openModal()
{
    modal.classList.add("show");
}

function closeModal()
{
    modal.classList.remove("show");

    editId = null;

    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
}

/* ---------------- LOAD CUSTOMERS ---------------- */

async function loadCustomers()
{
    tableBody.innerHTML = "";

    try
    {
        const result = await getCustomers();

        if (!result.success)
        {
            tableBody.innerHTML =
            `<tr><td colspan="7">Unable to load customers.</td></tr>`;
            return;
        }

        let data = result.data;

        // SEARCH FILTER
        const query = searchBox.value.toLowerCase();

        if (query)
        {
            data = data.filter(c =>
                (c.FirstName + " " + c.LastName).toLowerCase().includes(query) ||
                c.Phone.includes(query)
            );
        }

        if (data.length === 0)
        {
            tableBody.innerHTML =
            `<tr><td colspan="7">No customers found.</td></tr>`;
            return;
        }

        data.forEach(customer =>
        {
            tableBody.innerHTML += `
                <tr>
                    <td>${customer.CustomerID}</td>
                    <td>${customer.FirstName} ${customer.LastName}</td>
                    <td>${customer.Phone}</td>
                    <td>${customer.Email || ""}</td>
                    <td>${customer.City || ""}</td>
                    <td>₨ ${customer.Balance}</td>
                    <td>
                        <button class="btn btn-primary btn-small"
                            onclick="editCustomer(${customer.CustomerID})">
                            Edit
                        </button>

                        <button class="btn btn-small"
                            onclick="removeCustomer(${customer.CustomerID})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }
    catch (error)
    {
        console.error(error);
        tableBody.innerHTML =
        `<tr><td colspan="7">Server error.</td></tr>`;
    }
}

/* ---------------- SAVE (ADD / EDIT) ---------------- */

async function saveCustomer()
{
    const customer =
    {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        address: address.value.trim(),
        city: city.value.trim()
    };

    try
    {
        let result;

        if (editId)
        {
            result = await updateCustomer(editId, customer);

            if (result.success)
                showToast("Customer updated successfully");
        }
        else
        {
            result = await addCustomer(customer);

            if (result.success)
                showToast("Customer added successfully");
        }

        closeModal();
        loadCustomers();
    }
    catch (err)
    {
        console.error(err);
        showToast("Operation failed", "error");
    }
}

/* ---------------- DELETE ---------------- */

async function removeCustomer(customerId)
{
    if (!confirm("Delete this customer?"))
        return;

    const result = await deleteCustomer(customerId);

    if (result.success)
    {
        showToast("Customer deleted successfully");
        loadCustomers();
    }
    else
    {
        showToast("Delete failed", "error");
    }
}

/* ---------------- EDIT ---------------- */

async function editCustomer(id)
{
    const result = await getCustomers();

    const customer = result.data.find(c => c.CustomerID === id);

    editId = id;

    firstName.value = customer.FirstName;
    lastName.value = customer.LastName;
    phone.value = customer.Phone;
    email.value = customer.Email;
    address.value = customer.Address;
    city.value = customer.City;

    openModal();
}

/* ---------------- EVENTS ---------------- */

addCustomerButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);

saveCustomerButton.addEventListener("click", saveCustomer);

searchBox.addEventListener("input", loadCustomers);

document.addEventListener("DOMContentLoaded", loadCustomers);