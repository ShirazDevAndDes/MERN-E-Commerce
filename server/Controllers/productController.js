const productModel = require("../Models/productModel");

const products_get = async (req, res) => {
  try {
    const products = await productModel.getProducts(req.query);
    res.status(200).json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};
const product_get = async (req, res) => {
  try {
    const products = await productModel.getProduct(req.query);
    res.status(200).json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const product_create = async (req, res) => {
  try {
    const product = await productModel.createProduct(req.body);
    res.status(200).json({ msg: "Product Addded", result: product });
  } catch (error) {
    // console.log(error.message);
    res.status(400).json({ msg: error.message });
  }
};
const product_update = async (req, res) => {
  try {
    const product = await productModel.updateProduct(req.body);
    res.status(200).json({ msg: "Product Updated", result: product });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const product_delete = async (req, res) => {
  const { id } = req.body;
  try {
    const product = await productModel.deleteProduct(id);
    res.status(200).json({ msg: "Product Deleted", result: product });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  products_get,
  product_get,
  product_create,
  product_update,
  product_delete,
};
