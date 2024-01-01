const cardModel = require('../models/card');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const CastError = require('../middlewares/errors/CastError');
const ValidationError = require('../middlewares/errors/ValidationError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

function readAllCards(req, res, next) {
  return cardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const cardData = req.body;
  cardData.owner = req.user._id;

  return cardModel.create(cardData)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
}

function deleteCard(req, res, next) {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }

      if (req.user._id !== card.owner.toString()) {
        return next(new ForbiddenError('Вы не владелец карточки'));
      }

      return cardModel.deleteOne(card)
        .then((deletedCard) => {
          res.status(200).send(deletedCard);
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new CastError('Переданы некорректные данные для удаления карточки'));
          }
          return next(err);
        });
    })
    .catch(next);
}

function putLike(req, res, next) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Передан несуществующий _id карточки'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      return next(err);
    });
}

function deleteLike(req, res, next) {
  return cardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      return next(err);
    });
}

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
