const { handleJoiError } = require("../../utils/errorHandler");
const normalizeCard = require("../helpers/normalizeCard");
const validateCard = require("../validations/cardValidationService");

const {
  find,
  findOne,
  create,
  remove,
  update,
  like,
  findMyCards,
} = require("../models/cardsDataAccessService");

exports.getCards = async () => {
  try {
    const cards = await find();
    return cards;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getMyCards = async userId => {
  try {
    const cards = await findMyCards(userId);
    return cards;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.getCard = async id => {
  try {
    const card = await findOne(id);
    return card;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.createCard = async (rawCard, userId) => {
  const { error } = validateCard(rawCard);
  if (error) return handleJoiError(error);

  try {
    let card = await normalizeCard(rawCard, userId);
    card = await create(card);
    return card;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.updateCard = async (id, rawCard) => {
  const { error } = validateCard(rawCard);
  if (error) return handleJoiError(error);

  let card = normalizeCard(rawCard);

  try {
    card = await update(id, card);
    return card;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.deleteCard = async (cardId, userId) => {
  try {
    const card = await remove(cardId, userId);
    return card;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.likeCard = async (cardId, userId) => {
  try {
    const card = await like(cardId, userId);
    return card;
  } catch (error) {
    return Promise.reject(error);
  }
};
