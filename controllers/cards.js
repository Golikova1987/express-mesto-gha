const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  NotFoundError, CastError, IntervalServerError, Created,
} = require('../errors/errors');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(Created).send({ data: card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ message: `Карточка _id:${card._id} удалена` }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Карточка не найдена' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
