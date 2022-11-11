const express = require("express");
const { handleError } = require("../../utils/errorHandler");
const router = express.Router();
const {
  registerUser,
  getUsers,
  getUser,
  updateUser,
  changeUserBusinessStatus,
  deleteUser,
  loginUser,
} = require("../service/usersService");
const auth = require("../../auth/authService");

router.post("/", async (req, res) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body);
    return res.send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin)
      return handleError(
        res,
        403,
        "Authorization Error: You must be an admin user to see all users in the database"
      );
    const users = await getUsers();
    return res.send(users);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { _id, isAdmin } = req.user;
    const { id } = req.params;
    if (_id !== id && !isAdmin)
      return handleError(
        res,
        403,
        "Authorization Error: You must be an admin type user or the registered user to see this user"
      );
    const user = await getUser(id);
    return res.send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const rawUser = req.body;
    const { id } = req.params;
    const { _id } = req.user;
    if (_id !== id)
      return handleError(
        res,
        403,
        "Authorization Error: You must the registered user to update this user details"
      );

    const user = await updateUser(id, rawUser);
    return res.send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    let { id } = req.params;
    if (_id !== id && !req.user.isAdmin)
      return handleError(
        res,
        403,
        "Authorization Error: You must the registered user or admin to change this user status"
      );
    let user = await changeUserBusinessStatus(id);
    return res.send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    let { id } = req.params;
    if (_id !== id && !req.user.isAdmin)
      return handleError(
        res,
        403,
        "Authorization Error: You must be the registered user or an admin to delete this user"
      );
    const user = await deleteUser(id);
    return res.send(user);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

module.exports = router;
