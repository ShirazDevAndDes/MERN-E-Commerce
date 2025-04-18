const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    iconName: {
      type: String,
      required: true,
    },
    bgColor: {
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

categorySchema.statics.getCategories = async function (data) {
  const { search } = data;
  let searchQuery = {};

  if (search) {
    searchQuery = { ...searchQuery, name: search };
  }
  return await this.find(searchQuery);
};

categorySchema.statics.createCategory = async function (data) {
  const { name, iconName, bgColor } = data;

  if (!name || !iconName || !bgColor) {
    throw Error("Category name is empty");
  }

  return await this.create({ name, iconName, bgColor });
};

categorySchema.statics.updateCategory = async function (data) {
  const { id, name, iconName, bgColor } = data;

  if (!id) {
    throw Error("Category not selected");
  }

  if (!name || !iconName || !bgColor) {
    throw Error("Category name is empty");
  }

  return await this.findByIdAndUpdate(id, { name, iconName, bgColor });
};

categorySchema.statics.deleteCategory = async function (data) {
  const { id } = data;

  if (!id) {
    throw Error("Category not selected");
  }
  return await this.findByIdAndDelete(id);
};

module.exports = mongoose.model("categories", categorySchema);
