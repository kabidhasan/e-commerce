const { Router } = require("express");
const { transaction } = require("../controllers/transaction");
const router = Router();


router.post("/transaction", transaction);

module.exports = router;
