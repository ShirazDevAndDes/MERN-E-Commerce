const userModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

async function createToken(_id, secret) {
  const token = await jwt.sign({ id: _id }, secret, {
    expiresIn: "2d",
  });

  return token;
}

const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await userModel
      .signup(firstName, lastName, email, password, role)
      .then((user) => {
        const accessToken = createToken(user.id, process.env.JWT_ACCESS_SECRET);
        res.status(200).json({ user, accessToken, msg: "User Signed Up" });
      });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await userModel.login(email, password, role);
    const accessToken = await createToken(
      user.id,
      process.env.JWT_ACCESS_SECRET
    );
    res.status(200).json({ user, accessToken, msg: "User Logged In" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const logout = async (req, res) => {
  // console.log(req.body);
  try {
    const result = await userModel.logout(req.body);
    // console.log(result);
    res.status(200).json({ msg: "User Logged Out" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const result = await userModel.verifyToken(req.body);
    // console.log(result);
    res.status(200).json({ ...result, msg: "User Verified" });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = { signup, login, logout, verifyToken };
