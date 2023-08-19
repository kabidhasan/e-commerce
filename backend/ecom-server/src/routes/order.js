const { Router } = require("express");
const router = Router();
const {
  addToCart, placeOrder,
  
} = require("../controllers/order");
const { userAuth } = require("../middlewares/auth-middleware");

router.post(
  "/addToCart",addToCart
);
router.post("/placeOrder", userAuth, placeOrder);

module.exports = router;