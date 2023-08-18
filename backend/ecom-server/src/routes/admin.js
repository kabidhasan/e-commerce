const { Router } = require("express");
const router = Router();
const {login, test, adminProtected, logout, getAllOrders, getAllApprovedOrders, getAllPendingOrders} = require("../controllers/admin");
const { userAuth } = require("../middlewares/auth-middleware");
const { validationMiddleware } = require("../middlewares/validation-middleware");
const{isAdmin}= require("../middlewares/admin-middleware")

router.post("/login", login); 

router.get("/adminProtected", isAdmin, adminProtected); 

router.get("/getAllOrders", isAdmin, getAllOrders);

router.get("/getAllApprovedOrders", isAdmin, getAllApprovedOrders);

router.get("/getAllPendingOrders", isAdmin, getAllPendingOrders);



router.get("/logout", isAdmin, logout); 

module.exports = router;
