require("dotenv").config();

const app = require("./app");

const { connectDB } = require("./config/database");



const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
{
    console.log("Server running on port " + PORT);
});

async function startServer()
{
    try
    {
        await connectDB();

        app.listen(PORT, () =>
        {
            console.log("--------------------------------");

            console.log("ResellerZ ERP");

            console.log("--------------------------------");

            console.log(`Server Running : http://localhost:${PORT}`);

            console.log("Database       : Connected");

            console.log("--------------------------------");
        });
    }
    catch(error)
    {
        console.error(error);
    }
}

startServer();