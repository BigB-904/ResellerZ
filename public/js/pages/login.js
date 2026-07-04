const form =
document.getElementById("loginForm");

const message =
document.getElementById("message");

form.addEventListener("submit", async function(event)
{
    event.preventDefault();

    message.innerHTML="";

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    try
    {
        const result =
        await apiLogin(username,password);

        if(result.success)
        {
            saveToken(result.token);

            message.style.color="green";

            message.innerHTML="Login Successful";

            setTimeout(function()
            {
                window.location.href="/pages/dashboard/index.html";

            },1000);
        }
        else
        {
            message.style.color="red";

            message.innerHTML=result.message;
        }
    }
    catch(error)
    {
        message.style.color="red";

        message.innerHTML="Unable to connect to server.";
    }

});