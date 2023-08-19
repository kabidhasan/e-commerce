const { Router } = require("express");
const { getAllItems, getItemsByItemId, getCart } = require("../controllers/items");
const { userAuth } = require("../middlewares/auth-middleware");
const router = Router();

router.get("/getAllItems", getAllItems);
router.get("/getCart", userAuth, getCart);
module.exports = router;