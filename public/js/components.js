async function loadComponent(containerId,file)
{
    const response =
    await fetch(file);

    const html =
    await response.text();

    document
    .getElementById(containerId)
    .innerHTML = html;
}

async function initializeLayout(title)
{
    await loadComponent(
    "sidebarContainer",
    "/components/sidebar.html");

    await loadComponent(
    "topbarContainer",
    "/components/topbar.html");

    document
    .getElementById("pageTitle")
    .textContent = title;

    setActiveSidebar();
}

function setActiveSidebar()
{
    const current =
    window.location.pathname;

    const links =
    document.querySelectorAll(".sidebar nav a");

    links.forEach(function(link)
    {
        link.classList.remove("active");

        if(link.getAttribute("href") === current)
        {
            link.classList.add("active");
        }
    });
}

async function initializePurchasePage()
{
    await initializeLayout("Purchases");

    await loadComponent(
        "modalContainer",
        "/components/purchaseModal.html"
    );
}