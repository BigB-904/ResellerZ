const supplierModel =
require("../models/supplierModel");

module.exports =
{
    getAllSuppliers:
    supplierModel.getAllSuppliers,

    getSupplier:
    supplierModel.getSupplier,

    addSupplier:
    supplierModel.addSupplier,

    updateSupplier:
    supplierModel.updateSupplier,

    deleteSupplier:
    supplierModel.deleteSupplier
};