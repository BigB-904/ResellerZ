function saveToken(token)
{
    localStorage.setItem("token",token);
}

function getToken()
{
    return localStorage.getItem("token");
}

function logout()
{
    localStorage.removeItem("token");

    window.location.href="/pages/auth/login.html";
}

function isLoggedIn()
{
    return getToken()!=null;
}