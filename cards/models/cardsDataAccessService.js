const { handleBadRequest } = require("../../utils/errorHandler");
const Card = require("./mongodb/Card");
const config = require("config");

const db = config.get("DB") || "MONGODB";

exports.find = async () => {
  if (db === "MONGODB") {
    try {
      const cards = await Card.find();
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

exports.findMyCards = async userId => {
  if (db === "MONGODB") {
    try {
      const cards = await Card.find({ user_id: userId });
      return Promise.resolve(cards);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve([]);
};

exports.findOne = async id => {
  if (db === "MONGODB") {
    try {
      let card = await Card.findById(id);
      if (!card) throw new Error("Could not find this card in the database");
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve({});
};

exports.create = async normalizeCard => {
  if (db === "MONGODB") {
    try {
      let card = new Card(normalizeCard);
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve({});
};

exports.update = async (id, normalizeCard) => {
  if (db === "MONGODB") {
    try {
      let card = await Card.findByIdAndUpdate(id, await normalizeCard, {
        new: true,
      }); // לזכור להעביר מצד לקוח את המספר העסקי

      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("Card Updated!");
};

exports.like = async (cardId, userId) => {
  if (db === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      const cardLikes = card.likes.find(id => id === userId);
      if (!cardLikes) {
        card.likes.push(userId);
        card = await card.save();
        return Promise.resolve(card);
      }

      const cardFiltered = card.likes.filter(id => id !== userId);
      card.likes = cardFiltered;
      card = await card.save();
      return Promise.resolve(card);
    } catch (error) {
      error.status = 404;
      return handleBadRequest("Mongoose", error);
    }
  }

  return Promise.resolve("Card Updated!");
};

exports.remove = async (cardId, user) => {
  if (db === "MONGODB") {
    try {
      let card = await Card.findById(cardId);
      if (!card)
        throw new Error("A card with this ID cannot be found in the database");

      if (card.user_id != user._id && !user.isAdmin)
        throw new Error("You are not authorized to delete this card");

      await Card.findByIdAndDelete(cardId);
      return Promise.resolve(card);
    } catch (error) {
      if (error.message === "You are not authorized to delete this card")
        error.status = 403;
      error.status = error.status || 404;
      return handleBadRequest("Mongoose", error);
    }
  }
  return Promise.resolve("card deleted not in mongodb!");
};
