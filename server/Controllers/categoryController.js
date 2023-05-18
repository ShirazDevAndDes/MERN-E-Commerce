const categoryModel = require("../Models/categoryModel");

const categories_get = async (req, res) => {
  try {
    const categories = await categoryModel.getCategories(req.query);
    res.status(200).json({ result: categories });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const categories_create = async (req, res) => {
  try {
    const category = await categoryModel.createCategory(req.body);
    res.status(200).json({ result: category });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const categories_update = async (req, res) => {
  try {
    const category = await categoryModel.updateCategory(req.body);
    res.status(200).json({ result: category });
  } catch (error) {
    console.log({ id, name });
    res.status(400).json({ msg: error.message });
  }
};
const categories_delete = async (req, res) => {
  try {
    const category = await categoryModel.deleteCategory(req.body);
    res.status(200).json({ result: category });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  categories_get,
  categories_create,
  categories_update,
  categories_delete,
};
