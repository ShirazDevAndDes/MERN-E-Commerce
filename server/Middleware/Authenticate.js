const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");

const Authenticate = async function (req, res, next) {
  let verified = false;
  const accessToken = req.cookies.accessToken || null;

  if (!accessToken) {
    return res.status(401).json({ verified, msg: "Not Authorized" });
  }

  let verifyAccessToken = false;
  let verifyRefreshToken = false;

  const decodedToken = jwt.decode(accessToken);

  const user = await userModel.findById(decodedToken.id);

  verifyAccessToken = await jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET,
    async (err, doc) => {
      if (err) {
        return false;
      }
      verifyRefreshToken = true;
      return true;
    }
  );

  if (!verifyAccessToken) {
    verifyRefreshToken = await jwt.verify(
      user.refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, doc) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  }

  console.log("verifyAccessToken: ", verifyAccessToken);
  console.log("verifyRefreshToken: ", verifyRefreshToken);

  if (!verifyRefreshToken) {
    return res.status(401).json({ verified, msg: "Not Authorized" });
  } else {
    return next();
  }
};

module.exports = { Authenticate };
