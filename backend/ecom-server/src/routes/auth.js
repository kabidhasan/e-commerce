const { Router } = require("express");
const {
  getUsers,
  register,
  login,
  protected,
  logout,
  setPaymentInfo,
} = require("../controllers/auth");
const {
  registrationValidation,
  loginValidation,
} = require("../validators/auth");
const {
  validationMiddleware,
} = require("../middlewares/validation-middleware");
const { userAuth } = require("../middlewares/auth-middleware");
//const { update, getUserID } = require("../controllers/user-details");
const router = Router();

router.get("/all-users", getUsers);
router.post(
  "/register",
  registrationValidation,
  validationMiddleware,
  register
);
router.post("/login", loginValidation, validationMiddleware, login);
router.post("/setPaymentInfo", userAuth, setPaymentInfo);
router.get("/protected", userAuth, protected);
router.get("/logout", userAuth, logout);

module.exports = router;
