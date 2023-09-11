const { default: mongoose } = require("mongoose");
const validator = require("validator");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUTINARY_CLOUD_NAME,
  api_key: process.env.CLOUTINARY_API_KEY,
  api_secret: process.env.CLOUTINARY_API_SECRET,
});

const productSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
    },
    available_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
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

async function uploadImageToCloudinary(image) {
  if (!image) {
    throw Error("Image is not selected");
  }

  const imageNameLastDot = image.name.lastIndexOf(".");
  const imageName = image.name.substring(0, imageNameLastDot);

  const random = Math.floor(Math.random() * 6);

  return await cloudinary.uploader
    .upload(image.base64, {
      folder: "e-commerce-app/products",
      public_id: imageName + "-" + random,
      timeout: 1200000,
    })
    .then((result) => result)
    .catch((error) => {
      console.log(error);
      throw Error("Your image was not uploaded");
    });
}

async function deleteImageFromCloudinary(public_id) {
  cloudinary.uploader.destroy(public_id).then((result) => console.log(result));
}

productSchema.statics.getProducts = async function (data) {
  const {
    name = "",
    category = "",
    price = { min: "", max: "" },
    page = 1,
    limit = 10,
  } = data;
  // console.log("data: ", data);

  let mongoDBQuery = {};

  if (name) {
    mongoDBQuery = {
      ...mongoDBQuery,
      name: { $regex: ".*" + name + ".*", $options: "i" },
    };
  }

  if (category) {
    mongoDBQuery = {
      ...mongoDBQuery,
      category,
    };
  }

  if (price) {
    if (price.min > 0 || price.max > 0) {
      mongoDBQuery = {
        ...mongoDBQuery,
        price: { $gte: price.min, $lte: price.max },
      };
    }
  }
  // console.log("page: ", page);
  // console.log("query: ", mongoDBQuery);

  const findQuery = {
    ...mongoDBQuery,
    available_quantity: { $gt: 0 },
  };

  const products = await this.find(findQuery)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  const count = await this.find(findQuery).countDocuments();
  // console.log("products: ", products);
  // console.log("result: ", {
  //   products,
  //   totalPages: Math.ceil(count / limit),
  //   currentPage: page,
  // });
  return { products, totalPages: Math.ceil(count / limit), currentPage: page };
};

productSchema.statics.getProduct = async function (data) {
  const { id } = data;
  const product = await this.findById(id);

  return product;
};

productSchema.statics.createProduct = async function (data) {
  const {
    image,
    name,
    bgColor,
    description,
    price,
    category,
    available_quantity,
    currency,
  } = data;

  if (
    !name ||
    !bgColor ||
    !description ||
    !price ||
    !category ||
    !available_quantity ||
    !currency
  ) {
    throw Error("Fill in all fields");
  }

  if (!validator.isHexColor(bgColor)) {
    throw Error("Not a valid hex color");
  }

  if (!validator.isNumeric(price.toString())) {
    throw Error("Price is not a number");
  }

  if (!validator.isNumeric(available_quantity.toString())) {
    throw Error("Available Quantity is not a number");
  }

  if (!validator.isAlpha(currency)) {
    throw Error("Currency must contain only letters");
  }

  if (
    !validator.isAlphanumeric(name, undefined, { ignore: " -/()" }) ||
    !validator.isAlphanumeric(category, undefined, { ignore: " " })
  ) {
    let type;

    if (!validator.isAlphanumeric(name, undefined, { ignore: " -/()" })) {
      type = "name";
    }
    if (!validator.isAlphanumeric(category, undefined, { ignore: " " })) {
      type = "category";
    }

    throw Error(type + " must contain no special characters");
  }

  const imageResult = await uploadImageToCloudinary(image);

  const { asset_id, public_id, format, resource_type, secure_url } =
    imageResult;

  const result = await this.create({
    image: { asset_id, public_id, format, resource_type, secure_url },
    name,
    bgColor,
    description: validator.trim(description),
    price,
    category,
    available_quantity,
    currency,
  }).catch(async (error) => {
    console.log(error);
    await deleteImageFromCloudinary(public_id);
  });

  return result;
};

productSchema.statics.updateProduct = async function (data) {
  const {
    id,
    image,
    name,
    bgColor,
    description,
    price,
    category,
    available_quantity,
    currency,
  } = data;

  if (!id) {
    throw Error("Product not provided");
  }

  if (!name || !bgColor || !description || !price || !category) {
    throw Error("Fill in all fields");
  }

  if (!validator.isHexColor(bgColor)) {
    throw Error("Not a valid hex color");
  }

  if (!validator.isNumeric(price.toString())) {
    throw Error("Price is not a number");
  }

  if (!validator.isNumeric(available_quantity.toString())) {
    throw Error("Available Quantity is not a number");
  }

  if (!validator.isAlpha(currency)) {
    throw Error("Currency must contain only letters");
  }

  if (
    !validator.isAlphanumeric(name, undefined, { ignore: " -/()" }) ||
    !validator.isAlphanumeric(category, undefined, { ignore: " " })
  ) {
    let type;

    if (!validator.isAlphanumeric(name, undefined, { ignore: " -/()" })) {
      type = "name";
    }
    if (!validator.isAlphanumeric(category, undefined, { ignore: " " })) {
      type = "category";
    }

    throw Error(type + " must contain no special characters");
  }

  if (image) {
    const imageResult = await uploadImageToCloudinary(image);

    const { asset_id, public_id, format, resource_type, secure_url } =
      imageResult;

    const result = await this.findByIdAndUpdate(id, {
      image: { asset_id, public_id, format, resource_type, secure_url },
      name,
      bgColor,
      description: validator.trim(description),
      price,
      category,
      available_quantity,
      currency,
    }).catch(async (error) => {
      console.log(error);
      await deleteImageFromCloudinary(public_id);
    });

    return result;
  }

  return await this.findByIdAndUpdate(id, {
    name,
    description,
    bgColor,
    price,
    category,
    available_quantity,
    currency,
  });
};

productSchema.statics.deleteProduct = async function (id) {
  if (!id) {
    throw Error("Product not provided");
  }

  const product = await this.findByIdAndDelete(id);

  const productImage = product.image.public_id || null;

  if (productImage) {
    await deleteImageFromCloudinary(productImage);
  }

  return;
};

module.exports = mongoose.model("products", productSchema);
