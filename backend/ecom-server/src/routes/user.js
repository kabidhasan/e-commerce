const { Router } = require("express");
const router = Router();
const { getNameByEmail, getAddressByEmail, getBankAccByEmail, getAllOrdersByEmail } = require("../controllers/user");
const { userAuth } = require("../middlewares/auth-middleware");

router.get("/getNameByEmail", userAuth, getNameByEmail);
router.get("/getAddressByEmail", userAuth, getAddressByEmail);
router.get("/getBankByEmail", userAuth, getBankAccByEmail);
router.get("/getAllOrdersByEmail",  getAllOrdersByEmail);

module.exports = router;
