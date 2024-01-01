const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardsController = require('../controllers/cards');
const { regEx } = require('../utils/regEx');

router.get('/cards', cardsController.readAllCards);

router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(regEx),
    }),
  }),
  cardsController.createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  cardsController.deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  cardsController.putLike,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  cardsController.deleteLike,
);

module.exports = router;
