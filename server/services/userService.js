const sql = require("mssql");
const bcrypt = require("bcrypt");

async function createUser(pool, userData)
{
    const
    {
        username,
        password,
        firstName,
        lastName,
        email,
        phone,
        roleId
    } = userData;

    let result = await pool.request()
        .input("Username", sql.NVarChar, username)
        .query(`
            SELECT UserID
            FROM Users
            WHERE Username = @Username
        `);

    if (result.recordset.length > 0)
    {
        throw new Error("Username already exists.");
    }

    result = await pool.request()
        .input("Email", sql.NVarChar, email)
        .query(`
            SELECT UserID
            FROM Users
            WHERE Email = @Email
        `);

    if (result.recordset.length > 0)
    {
        throw new Error("Email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.request()
        .input("RoleID", sql.Int, roleId)
        .input("Username", sql.NVarChar, username)
        .input("PasswordHash", sql.NVarChar, passwordHash)
        .input("FirstName", sql.NVarChar, firstName)
        .input("LastName", sql.NVarChar, lastName)
        .input("Email", sql.NVarChar, email)
        .input("Phone", sql.NVarChar, phone)
        .query(`
            INSERT INTO Users
            (
                RoleID,
                Username,
                PasswordHash,
                FirstName,
                LastName,
                Email,
                Phone
            )
            VALUES
            (
                @RoleID,
                @Username,
                @PasswordHash,
                @FirstName,
                @LastName,
                @Email,
                @Phone
            )
        `);
}

async function findUserByUsername(pool, username)
{
    const result = await pool.request()
        .input("Username", sql.NVarChar, username)
        .query(`
            SELECT
                UserID,
                RoleID,
                Username,
                PasswordHash,
                FirstName,
                LastName,
                Email,
                IsActive
            FROM Users
            WHERE Username = @Username
        `);

    if (result.recordset.length === 0)
    {
        return null;
    }

    return result.recordset[0];
}

module.exports =
{
    createUser,
    findUserByUsername
};