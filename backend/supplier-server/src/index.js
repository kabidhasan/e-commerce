const express = require("express");
const { json } = require("express");
const app = express();
const { PORT, CLIENT_URL } = require("./constants");
const authRoutes = require("./routes/auth");
const orderRoutes = require ("./routes/order")
const cookieParser = require("cookie-parser");
const cors = require("cors");
//const passport = require("passport");

//require("./middlewares/passport-middleware");

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
//app.use(passport.initialize());


app.use("/supplier/", authRoutes);
app.use("/supplier/", orderRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});
