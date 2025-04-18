const ordersModel = require("../Models/ordersModel");

const orderStatusChange = async (req, res) => {
  try {
    const orders = await ordersModel.changeOrderStatus(req.body);
    res.status(200).json({
      result: orders,
      msg: "Orders Status Changed",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const orders_get = async (req, res) => {
  try {
    const orders = await ordersModel.getOrders(req.query);
    res.status(200).json({
      result: orders,
      msg: "Orders Retrieved",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const orderCheckout = async (req, res) => {
  let orderSessionID = null;
  let orderSession = null;
  try {
    const order_pending = await ordersModel.checkoutCreateSession(req.body);
    if (order_pending) {
      orderSessionID = order_pending.id;
      orderSession = await ordersModel.checkoutSetupSession(order_pending);
    }

    const { cancel_url, success_url, url } = orderSession;

    res.status(200).json({
      result: { cancel_url, success_url, url },
      msg: "Checkout pending",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const orderCheckout_Success = async (req, res) => {
  try {
    const order = ordersModel.checkoutSuccess(req.body);
    res.status(200).json({ result: order, msg: "Checkout Complete" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

const orderCheckout_Cancel = async (req, res) => {
  try {
    const orderCancel = await ordersModel.checkoutCancel(req.body);
    res.status(200).json({ result: orderCancel, msg: "Checkout Canceled" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  orders_get,
  orderStatusChange,
  orderCheckout,
  orderCheckout_Success,
  orderCheckout_Cancel,
};
