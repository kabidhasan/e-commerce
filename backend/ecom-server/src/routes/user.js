const { Router } = require("express");
const router = Router();
const { getNameByEmail, getAddressByEmail, getBankAccByEmail } = require("../controllers/user");
const { userAuth } = require("../middlewares/auth-middleware");

router.get("/getNameByEmail", userAuth, getNameByEmail);
router.get("/getAddressByEmail", userAuth, getAddressByEmail);
router.get("/getBankByEmail", userAuth, getBankAccByEmail );

module.exports = router;
