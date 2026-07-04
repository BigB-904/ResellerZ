const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { getPool } = require("../config/database");
const userService = require("../services/userService");
const { validateRegistration } = require("../utils/validation");

async function register(req, res)
{
    try
    {
        const errors = validateRegistration(req.body);

        if (errors.length > 0)
        {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        const pool = getPool();

        await userService.createUser(pool, req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully."
        });
    }
    catch (error)
    {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function login(req, res)
{
    try
    {
        const { username, password } = req.body;

        const pool = getPool();

        const user = await userService.findUserByUsername(
            pool,
            username
        );

        if (!user)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.PasswordHash
            );

        if (!passwordMatches)
        {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user.UserID,
                roleId: user.RoleID
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user:
            {
                id: user.UserID,
                username: user.Username,
                firstName: user.FirstName,
                lastName: user.LastName,
                roleId: user.RoleID
            }
        });
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function profile(req, res)
{
    res.json({
        success: true,
        message: "Protected route accessed successfully.",
        user: req.user
    });
}

module.exports =
{
    register,
    login,
    profile
};