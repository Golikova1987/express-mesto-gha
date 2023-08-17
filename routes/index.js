const router = require('express').Router();
const users = require('./users');
const cards = require('./cards');
const registerUser = require('./signup');
const authUser = require('./signin');

const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors/NotFoundError');

router.use('/signup', registerUser);
router.use('/signin', authUser);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
