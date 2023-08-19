const passport = require("passport");
const { Strategy } = require("passport-jwt");
const { SECRET } = require("../constants");
const db = require("../db");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) token = req.cookies["token"];
  return token;
};

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async ({ acc_no }, done) => {
    try {
      const { rows } = await db.query(
        "SELECT  acc_no FROM bank_user WHERE acc_no = $1",
        [acc_no]
      );

      if (!rows.length) {
        throw new Error("401 not authorized");
      }

      let user = { acc_no: rows[0].acc_no };

      return await done(null, user);
    } catch (error) {
      console.log(error.message);
      done(null, false);
    }
  })
);
