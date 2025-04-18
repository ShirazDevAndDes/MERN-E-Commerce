const bannerModel = require("../Models/bannerModel");

const banners_get = async (req, res) => {
  try {
    const banner = await bannerModel.getBanners();
    res.status(200).json({ result: banner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const banner_create = async (req, res) => {
  try {
    const banner = await bannerModel.createBanner(req.body);
    res.status(200).json({ result: banner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const banner_update = async (req, res) => {
  // console.log(req.body);
  try {
    const banner = await bannerModel.updateBanner(req.body);
    res.status(200).json({ result: banner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
const banner_delete = async (req, res) => {
  const { id } = req.body;
  try {
    const banner = await bannerModel.deleteBanner(id);
    res.status(200).json({ result: banner });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  banners_get,
  banner_create,
  banner_update,
  banner_delete,
};
