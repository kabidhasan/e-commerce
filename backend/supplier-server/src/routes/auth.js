const { Router } = require("express");
const router = Router();
const {
  login,
  logout,
  supplierProtected,
} = require("../controllers/auth");

const { isSupplier } = require("../middlewares/supplier-middleware");
const { getAllOrders, getAllPendingOrders, getAllShippedOrders } = require("../controllers/order");

router.post("/login", login);
router.get("/supplierProtected", isSupplier, supplierProtected);
router.get("/logout", isSupplier, logout);
router.get("getAllOrders", isSupplier, getAllOrders);
router.get("getAllPendingOrders", isSupplier, getAllPendingOrders);
router.get("getAllShippedOrders", isSupplier, getAllShippedOrders);

module.exports = router;

