const sql = require("mssql");
require("dotenv").config();

const config =
{
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),

    options:
    {
        instanceName: process.env.DB_INSTANCE,
        encrypt: false,
        trustServerCertificate: true
    }
};

let pool = null;

async function connectDB()
{
    try
    {
        if (!pool)
        {
            pool = await sql.connect(config);
            console.log("Connected to SQL Server successfully.");
        }

        return pool;
    }
    catch (error)
    {
        console.error("Database connection failed.");
        throw error;
    }
}

function getPool()
{
    return pool;
}

module.exports =
{
    connectDB,
    getPool
};