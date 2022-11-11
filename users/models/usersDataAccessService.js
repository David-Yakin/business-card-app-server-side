const { handleBadRequest } = require("../../utils/errorHandler");
const User = require("./mongodb/User");
const lodash = require("lodash");
const { comparePassword } = require("../helpers/bcrypt");
const { generateAuthToken } = require("../../auth/Providers/jwt");

const config = require("config");
const db = config.get("DB").trim() || "MONGODB"; // process.env

exports.register = async normalizeUser => {
  if (db === "MONGODB") {
    try {
      const { email } = normalizeUser;
      let user = await User.findOne({ email });
      if (user) throw new Error("User already registered");
      user = new User(normalizeUser);
      user = await user.save();
      user = lodash.pick(user, ["name", "email", "_id"]);
      return Promise.resolve(user);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve({});
};

exports.login = async ({ email, password }) => {
  if (db === "MONGODB") {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid email or password");

      const validPassword = comparePassword(password, user.password);
      if (!validPassword) throw new Error("Invalid email or password");

      const token = generateAuthToken(user);
      return Promise.resolve(token);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

exports.find = async () => {
  if (db === "MONGODB") {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });
      return Promise.resolve(users);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

exports.findOne = async id => {
  if (db === "MONGODB") {
    try {
      let user = await User.findById(id, {
        password: 0,
        __v: 0,
        isAdmin: 0,
        isBlogger: 0,
      });
      if (!user) throw new Error("Could not find this user in the database");
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

exports.update = async (id, normalizeUser) => {
  if (db === "MONGODB") {
    try {
      let user = await User.findByIdAndUpdate(id, normalizeUser, {
        new: true,
      }).select(["-password", "-__v"]);

      if (!user)
        throw new Error(
          "Could not update this user because a user with this ID cannot be found in the database"
        );
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("User Updated!");
};

exports.changeIsBizStatus = async id => {
  if (db === "MONGODB") {
    try {
      const pipeline = [{ $set: { isBusiness: { $not: "$isBusiness" } } }];
      const user = await User.findByIdAndUpdate(id, pipeline, {
        new: true,
      }).select(["-password", "-__v", "-isAdmin", "-isBlogger"]);

      if (!user)
        throw new Error(
          "Could not update this user isBusiness status because a user with this ID cannot be found in the database"
        );
      return Promise.resolve(user);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Card Updated!");
};

exports.remove = async id => {
  if (db === "MONGODB") {
    try {
      let user = await User.findByIdAndDelete(id, { password: 0, __v: 0 });
      if (!user)
        throw new Error(
          "Could not delete this user because a user with this ID cannot be found in the database"
        );
      return Promise.resolve(user);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb!");
};
