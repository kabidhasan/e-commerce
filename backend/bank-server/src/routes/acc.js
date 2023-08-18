const { Router } = require("express");
const { getBalanceByAccNo } = require("../controllers/acc");
const { transaction } = require("../controllers/transaction");
const router = Router();

router.get("/getBalanceByAccNo", getBalanceByAccNo);
router.get("/transaction", transaction);

module.exports = router