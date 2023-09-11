const { default: mongoose, SchemaTypes } = require("mongoose");
const validator = require("validator");
const stripe = require("stripe")(
  process.env.STRIPE_KEY
);

const ordersSchema = new mongoose.Schema(
  {
    userInfo: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shipping: {
      type: Number,
      required: true,
    },
    sessionStatus: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, returnValue) => {
    delete returnValue._id;
    delete returnValue.__v;
  },
});

ordersSchema.statics.changeOrderStatus = async function (data) {
  const { orderId, status } = data;
  // console.log(data);

  let result = false;

  await this.findByIdAndUpdate(orderId, { status }).then(() => {
    result = true;
  });

  return result;
};

ordersSchema.statics.getOrders = async function (data) {
  const { userId, ordersCurrentPage, limit = 8 } = data;
  // console.log(ordersCurrentPage);
  const {
    allOrdersCurrentPage = 1,
    pendingCurrentPage = 1,
    acceptedCurrentPage = 1,
    completeCurrentPage = 1,
    canceledCurrentPage = 1,
  } = ordersCurrentPage;

  const fixedFindQueryVariables = {
    "userInfo.id": userId,
    sessionStatus: "complete",
  };

  const allOrdersFindQuery = {
    ...fixedFindQueryVariables,
  };
  const pendingFindQuery = {
    ...fixedFindQueryVariables,
    status: "pending",
  };
  const acceptedFindQuery = {
    ...fixedFindQueryVariables,
    status: "accepted",
  };
  const completeFindQuery = {
    ...fixedFindQueryVariables,
    status: "complete",
  };
  const canceledFindQuery = {
    ...fixedFindQueryVariables,
    status: "canceled",
  };

  const allOrdersTotalPages = await this.find(
    allOrdersFindQuery
  ).countDocuments();
  const pendingTotalPages = await this.find(pendingFindQuery).countDocuments();
  const acceptedTotalPages = await this.find(
    acceptedFindQuery
  ).countDocuments();
  const completeTotalPages = await this.find(
    completeFindQuery
  ).countDocuments();
  const canceledTotalPages = await this.find(
    canceledFindQuery
  ).countDocuments();

  const allOrders = await this.find(allOrdersFindQuery)
    .limit(limit)
    .skip((allOrdersCurrentPage - 1) * limit);
  const pending = await this.find(pendingFindQuery)
    .limit(limit)
    .skip((pendingCurrentPage - 1) * limit);
  const accepted = await this.find(acceptedFindQuery)
    .limit(limit)
    .skip((acceptedCurrentPage - 1) * limit);
  const complete = await this.find(completeFindQuery)
    .limit(limit)
    .skip((completeCurrentPage - 1) * limit);
  const canceled = await this.find(canceledFindQuery)
    .limit(limit)
    .skip((canceledCurrentPage - 1) * limit);

  return {
    all_Orders: {
      orders: allOrders,
      totalPages: Math.ceil(allOrdersTotalPages / limit),
      currentPage: allOrdersCurrentPage,
    },
    pending: {
      orders: pending,
      totalPages: Math.ceil(pendingTotalPages / limit),
      currentPage: pendingCurrentPage,
    },
    accepted: {
      orders: accepted,
      totalPages: Math.ceil(acceptedTotalPages / limit),
      currentPage: acceptedCurrentPage,
    },
    complete: {
      orders: complete,
      totalPages: Math.ceil(completeTotalPages / limit),
      currentPage: completeCurrentPage,
    },
    canceled: {
      orders: canceled,
      totalPages: Math.ceil(canceledTotalPages / limit),
      currentPage: canceledCurrentPage,
    },
  };
};

ordersSchema.statics.checkoutSetupSession = async function (data) {
  const { id: checkoutID, items, shipping } = data;

  const session = Promise.all(
    items.map((item) => {
      return {
        //     adjustable_quantity: { enabled: true, maximum: 10, minimum: 0 },
        quantity: item.quantity,
        price_data: {
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price + "00",
          currency: "usd",
        },
      };
    })
  ).then(async (line_items) => {
    return await stripe.checkout.sessions.create({
      success_url: process.env.STRIPE_SUCCESS_URL + checkoutID,
      cancel_url: process.env.STRIPE_CANCEL_URL + checkoutID,
      line_items: line_items,
      // discounts: [
      //   {
      //     coupon: "MwrPUb73",
      //   },
      // ],
      mode: "payment",
    });
  });

  return session;
};

ordersSchema.statics.checkoutCreateSession = async function (data) {
  const { userInfo, items, subTotal, shipping } = data;

  if (typeof userInfo !== "object") {
    throw Error("User information is not valid");
  }

  if (!Array.isArray(items)) {
    throw Error("Items are not valid");
  }

  if (!validator.isNumeric(subTotal.toString())) {
    throw Error("Total is not a number");
  }

  if (!validator.isNumeric(shipping.toString())) {
    throw Error("Shipping is not a number");
  }

  const orderPending = await this.create({
    userInfo,
    items,
    subTotal,
    shipping,
    sessionStatus: "pending",
    status: "pending",
  });

  if (orderPending) {
    return { id: orderPending.id, items, shipping };
  }
  return false;
};

ordersSchema.statics.checkoutSuccess = async function (data) {
  const { id } = data;

  const order = await this.findByIdAndUpdate(id, { sessionStatus: "complete" });

  if (!order) {
    throw Error("Your order could not be completed");
  }

  if (order) {
    return true;
  }

  return false;
};

ordersSchema.statics.checkoutError = async function () {};

ordersSchema.statics.checkoutCancel = async function (data) {
  const { id } = data;

  const order = await this.findByIdAndDelete(id);

  if (!order) {
    throw new Error("Your order could not be canceled");
  }

  if (order) {
    return true;
  }

  return false;
};

module.exports = mongoose.model("orders", ordersSchema);
