const { handleJoiError } = require("../../utils/errorHandler");
const normalizeUser = require("../helpers/normalizeUser");

const {
  find,
  findOne,
  login,
  remove,
  update,
  changeIsBizStatus,
  register,
} = require("../models/usersDataAccessService");
const { generateUserPassword } = require("../helpers/bcrypt");
const {
  validateRegistration,
  validateLogin,
  validateUser,
} = require("../validations/userValidationService");

exports.registerUser = async rawUser => {
  const { error } = validateRegistration(rawUser);
  if (error) return handleJoiError(error);
  try {
    let user = normalizeUser(rawUser);
    if (!user.password) throw new Error("Please enter password");
    user.password = generateUserPassword(user.password);
    user = await register(user);
    return user;
  } catch (error) {
    error.status = 400;
    return Promise.reject(error);
  }
};

exports.loginUser = async user => {
  const { error } = validateLogin(user);
  if (error) return handleJoiError(error);
  try {
    const token = await login(user);
    return token;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getUsers = async () => {
  try {
    const users = await find();
    return users;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getUser = async id => {
  try {
    const user = await findOne(id);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.updateUser = async (id, rawUser) => {
  const { error } = validateUser(rawUser);
  if (error) return handleJoiError(error);

  let user = normalizeUser(rawUser);

  try {
    user = await update(id, user);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.changeUserBusinessStatus = async id => {
  try {
    const user = await changeIsBizStatus(id);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.deleteUser = async id => {
  try {
    const user = await remove(id);
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};
