function validateRegistration(data)
{
    const errors = [];

    if (!data.username || data.username.trim() === "")
    {
        errors.push("Username is required.");
    }

    if (!data.password || data.password.length < 8)
    {
        errors.push("Password must be at least 8 characters.");
    }

    if (!data.firstName || data.firstName.trim() === "")
    {
        errors.push("First name is required.");
    }

    if (!data.lastName || data.lastName.trim() === "")
    {
        errors.push("Last name is required.");
    }

    if (!data.email || data.email.trim() === "")
    {
        errors.push("Email is required.");
    }
    else
    {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(data.email))
        {
            errors.push("Invalid email address.");
        }
    }

    if (!data.roleId)
    {
        errors.push("Role is required.");
    }

    return errors;
}

module.exports =
{
    validateRegistration
};