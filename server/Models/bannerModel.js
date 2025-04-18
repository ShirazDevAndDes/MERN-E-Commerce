const { default: mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;
const validator = require("validator");

cloudinary.config({
  cloud_name: process.env.CLOUTINARY_CLOUD_NAME,
  api_key: process.env.CLOUTINARY_API_KEY,
  api_secret: process.env.CLOUTINARY_API_SECRET,
});

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: Object,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
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
      // public_id: imageName + "-" + random,
      public_id: imageName,
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

bannerSchema.statics.getBanners = async function () {
  const result = await this.find();

  return result;
};

bannerSchema.statics.createBanner = async function (data) {
  const { image, name, description, bgColor } = data;

  if (!name || !description || !bgColor) {
    throw Error("Please fill in all fields");
  }

  if (!validator.isHexColor(bgColor)) {
    throw Error("Not a valid hex color");
  }

  if (
    !validator.isAlphanumeric(name, undefined, { ignore: " " }) ||
    !validator.isAlphanumeric(description, undefined, { ignore: ".',\n " })
  ) {
    let type;

    if (!validator.isAlphanumeric(name, undefined, { ignore: " " })) {
      type = "name";
    }
    if (
      !validator.isAlphanumeric(description, undefined, { ignore: ".',\n " })
    ) {
      type = "description";
    }

    throw Error(type + " must contain no special characters");
  }

  const imageResult = await uploadImageToCloudinary(image);

  const { asset_id, public_id, format, resource_type, secure_url } =
    imageResult;

  const result = await this.create({
    image: { asset_id, public_id, format, resource_type, secure_url },
    name,
    description,
    bgColor,
  }).catch(async (error) => {
    console.log(error);
    await deleteImageFromCloudinary(public_id);
  });

  return result;
};

bannerSchema.statics.updateBanner = async function (data) {
  const { id, image, name, description, bgColor } = data;

  if (!validator.isHexColor(bgColor)) {
    throw Error("Not a valid hex color");
  }

  if (
    !validator.isAlphanumeric(name, undefined, { ignore: " " }) ||
    !validator.isAlphanumeric(description, undefined, { ignore: ".',\n " })
  ) {
    let type;

    if (!validator.isAlphanumeric(name, undefined, { ignore: " " })) {
      type = "name";
    }
    if (
      !validator.isAlphanumeric(description, undefined, { ignore: ".',\n " })
    ) {
      type = "description";
    }

    throw Error(type + " must contain no special characters");
  }

  let result;

  if (image !== "") {
    const imageResult = await uploadImageToCloudinary(image);

    const { asset_id, public_id, format, resource_type, secure_url } =
      imageResult;

    result = await this.findByIdAndUpdate(id, {
      image: { asset_id, public_id, format, resource_type, secure_url },
      name,
      description,
      bgColor,
    }).catch(async (error) => {
      console.log(error);
      await deleteImageFromCloudinary(public_id);
    });
  }

  result = await this.findByIdAndUpdate(id, {
    name,
    description,
    bgColor,
  });

  return result;
};

bannerSchema.statics.deleteBanner = async function (id) {
  if (!id) {
    throw Error("Banner Not Provided");
  }

  const banner = await this.findByIdAndDelete(id);

  const bannerImage = banner.image.public_id || null;

  if (bannerImage) {
    await deleteImageFromCloudinary(bannerImage);
  }

  return;
};

module.exports = mongoose.model("banners", bannerSchema);
