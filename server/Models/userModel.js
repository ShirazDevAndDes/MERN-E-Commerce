const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      // required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

async function createToken(_id, secret) {
  const token = await jwt.sign({ id: _id }, secret, {
    expiresIn: "15d",
  });

  return token;
}

userSchema.statics.signup = async function (
  firstName,
  lastName,
  email,
  password,
  role
) {
  if (!firstName || !lastName || !email || !password || !role) {
    throw Error("Please fill in all fields");
  }

  if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    throw Error("Only letters in First and Last name");
  }

  if (!validator.isEmail(email)) {
    throw Error("Your E-mail is invalid");
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minUppercase: 0,
      minSymbols: 0,
    })
  ) {
    throw Error("Your Password is not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password, salt);

  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashPass,
    role,
  });

  return user;
};

userSchema.statics.login = async function (email, password, role) {
  if (!validator.isEmail(email)) {
    throw Error("Your E-mail is invalid");
  }

  const user = await this.findOne({ email, role });

  if (!user) {
    throw Error("User doesn't exists");
  }

  const verifyPass = await bcrypt.compare(password, user.password);

  if (!verifyPass) {
    throw Error("Your password is incorrect");
  }

  mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, returnValue) => {
      delete returnValue._id;
      delete returnValue.__v;
      delete returnValue.password;
      delete returnValue.refreshToken;
      delete returnValue.createdAt;
      delete returnValue.updatedAt;
    },
  });

  const refreshToken = await createToken(
    user.id,
    process.env.JWT_REFRESH_SECRET
  );

  const updateUserToken = await this.findByIdAndUpdate(user.id, {
    refreshToken,
  });

  if (!updateUserToken) {
    throw Error("You were not able to login please try again");
  }

  return user;
};

userSchema.statics.logout = async function (data) {
  const { id = "" } = data;
  // console.log(id);
  if (id) {
    await this.findByIdAndUpdate(id, {
      refreshToken: "",
    });
  }

  return;
};

userSchema.statics.verifyToken = async function (data) {
  const { accessToken } = data;

  mongoose.set("toJSON", {
    virtuals: true,
    transform: (doc, returnValue) => {
      delete returnValue._id;
      delete returnValue.__v;
      delete returnValue.password;
      delete returnValue.refreshToken;
      delete returnValue.createdAt;
      delete returnValue.updatedAt;
    },
  });

  let verifyAccessToken = false;
  let verifyRefreshToken = false;

  const decodedToken = jwt.decode(accessToken);

  const user = await this.findById(decodedToken.id);

  const newAccessToken = await createToken(
    user.id,
    process.env.JWT_ACCESS_SECRET
  );

  verifyAccessToken = await jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET,
    async (err, doc) => {
      if (err) {
        return false;
      }
      verifyRefreshToken = true;
      return true;
    }
  );

  if (!verifyAccessToken) {
    verifyRefreshToken = await jwt.verify(
      user.refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, doc) => {
        if (err) {
          return false;
        }
        return true;
      }
    );
  }

  // console.log(verifyAccessToken);
  // console.log(verifyRefreshToken);

  if (!verifyRefreshToken) {
    throw Error("Invalid Refresh Token");
  }

  return { user, accessToken: newAccessToken };
};

module.exports = mongoose.model("users", userSchema);
