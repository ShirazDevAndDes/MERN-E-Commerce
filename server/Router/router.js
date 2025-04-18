const express = require("express");
const {
  banners_get,
  banner_create,
  banner_update,
  banner_delete,
} = require("../Controllers/bannerController");
const {
  categories_get,
  categories_create,
  categories_update,
  categories_delete,
} = require("../Controllers/categoryController");
const {
  products_get,
  product_get,
  product_create,
  product_update,
  product_delete,
} = require("../Controllers/productController");
const {
  signup,
  login,
  logout,
  verifyToken,
} = require("../Controllers/userController");
const {
  orders_get,
  orderStatusChange,
  orderCheckout,
  orderCheckout_Success,
  orderCheckout_Cancel,
} = require("../Controllers/orderController");
const { Authenticate } = require("../Middleware/Authenticate");
const router = express.Router();

router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/logout", logout);
router.post("/user/verifyToken", verifyToken);

router.get("/banners", banners_get);
router.get("/categories", categories_get);
router.get("/products", products_get);
router.get("/product", product_get);
router.get("/orders", orders_get);
router.post("/orders/statusChange", orderStatusChange);

router.post("/banner", Authenticate, banner_create);
router.put("/banner", Authenticate, banner_update);
router.delete("/banner", Authenticate, banner_delete);

router.post("/categories", Authenticate, categories_create);
router.put("/categories", Authenticate, categories_update);
router.delete("/categories", Authenticate, categories_delete);

router.post("/product", Authenticate, product_create);
router.put("/product", Authenticate, product_update);
router.delete("/product", Authenticate, product_delete);

router.post("/checkout", Authenticate, orderCheckout);
router.post("/checkout/success", orderCheckout_Success);
router.post("/checkout/cancel", orderCheckout_Cancel);

module.exports = router;
