const express = require("express");
const router = express.Router();
const { handleError } = require("../../utils/errorHandler");
const {
  getCards,
  getCard,
  createCard,
  deleteCard,
  updateCard,
  likeCard,
  getMyCards,
} = require("../services/cardService");
const auth = require("../../auth/authService");

router.get("/", async (req, res) => {
  try {
    const cards = await getCards();
    return res.send(cards);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const { _id } = req.user;
    const cards = await getMyCards(_id);
    return res.send(cards);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const card = await getCard(id);
    return res.send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user.isBusiness)
      return handleError(
        res,
        403,
        "Business Authentication Error: You must be a business type user to create a new business card"
      );

    let card = req.body;
    card = await createCard(card, user._id);
    return res.status(201).send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const rawCard = req.body;
    const { id } = req.params;
    const user = req.user;
    if (user._id !== rawCard.userId)
      return handleError(
        res,
        403,
        "Authorization Error: Only an admin or the user who created the business card can update its details"
      );

    const card = await updateCard(id, rawCard);
    return res.send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const userId = "123456";
    let { id } = req.params;
    let card = await likeCard(id, userId);
    return res.send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const card = await deleteCard(id, user);
    return res.send(card);
  } catch (error) {
    const { status } = error;
    return handleError(res, status || 500, error.message);
  }
});

module.exports = router;
