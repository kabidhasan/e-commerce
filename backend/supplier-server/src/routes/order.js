const { Router } = require("express");
const router = Router();

const { isSupplier } = require("../middlewares/supplier-middleware");
const {
  getAllOrders,
  getAllPendingOrders,
  getAllShippedOrders,
  createOrder,
  shipOrder,
} = require("../controllers/order");


router.post("/createOrder", createOrder);
router.get("/getAllOrders", isSupplier, getAllOrders);
router.get("/getAllPendingOrders", isSupplier, getAllPendingOrders);
router.get("/getAllShippedOrders", isSupplier, getAllShippedOrders);
router.post("/shipOrder", isSupplier, shipOrder);

module.exports = router;
