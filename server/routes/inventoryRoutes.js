const express =
    require("express");

const router =
    express.Router();

const inventoryController =
    require("../controllers/inventoryController");

router.get(
    "/",
    inventoryController.getInventory);

router.get(
    "/stats",
    inventoryController.getInventoryStats);

router.get(
    "/transactions/:id",
    inventoryController.getTransactions);

router.post(
    "/stockin",
    inventoryController.stockIn);

router.post(
    "/stockout",
    inventoryController.stockOut);

module.exports =
    router;