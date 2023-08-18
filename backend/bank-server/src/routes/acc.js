const { Router } = require("express");
const { getBalanceByAccNo } = require("../controllers/acc");
const router = Router();

router.get("/getBalanceByAccNo",getBalanceByAccNo)

module.exports = router