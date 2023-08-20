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
router.get("/getAllOrders", getAllOrders);
router.get("/getAllPendingOrders", getAllPendingOrders);
router.get("/getAllShippedOrders",  getAllShippedOrders);
router.post("/shipOrder", shipOrder);

module.exports = router;
