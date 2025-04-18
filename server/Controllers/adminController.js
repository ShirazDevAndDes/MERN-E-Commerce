const userModel = require("../Models/userModel");
const productModel = require("../Models/productModel");
const categoryModel = require("../Models/categoryModel");
const jwt = require("jsonwebtoken");

function createToken(_id) {
  const token = jwt.sign({ id: _id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });

  return token;
}

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password, "admin");

    const accessToken = createToken(user.id);

    res.status(200).json({ user, accessToken });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

const categories_create = (req, res) => {
  const { image, title, description, price, categories } = req.body;
  try {
    const category = categoryModel.createCategory(
      image,
      title,
      description,
      price,
      categories
    );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const categories_update = (req, res) => {
  const { id, image, title, description, price, categories } = req.body;
  try {
    const category = categoryModel.updateCategory(
      id,
      image,
      title,
      description,
      price,
      categories
    );
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const categories_delete = (req, res) => {
  const { id } = req.body;
  try {
    const category = categoryModel.deleteCategory(id);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const product_create = (req, res) => {
  const { name } = req.body;
  try {
    const product = productModel.createProduct(name);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const product_update = (req, res) => {
  const { id, name } = req.body;
  try {
    const product = productModel.updateProduct(id, name);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const product_delete = (req, res) => {
  const { id } = req.body;
  try {
    const product = productModel.deleteProduct(id);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  adminLogin,
  categories_create,
  categories_update,
  categories_delete,
  product_create,
  product_update,
  product_delete,
};
