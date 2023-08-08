const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const {
  NotFoundError, CastError, IntervalServerError, Created,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Пользователь не найден.' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(Created).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(CastError).send({ message: 'Переданы некорректные данные' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.status(IntervalServerError).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
