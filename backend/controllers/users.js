const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const CastError = require('../middlewares/errors/CastError');
const ConflictError = require('../middlewares/errors/ConflictError');
const ValidationError = require('../middlewares/errors/ValidationError');
const UnauthorizedError = require('../middlewares/errors/UnauthorizedError');

const { JWT_SECRET, SALT_ROUNDS = 10, NODE_ENV } = process.env;

function readMe(req, res, next) {
  const { _id } = req.user;
  userModel.find({ _id })
    .then((user) => {
      if (!user || user.length === 0) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(...user);
    })
    .catch(next);
}

async function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CastError('Почта или пароль отсутствуют'));
  }

  try {
    const user = await userModel.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new UnauthorizedError('Неправильная почта или пароль'));
    }

    const payload = { _id: user._id };
    const token = jwt.sign(
      payload,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, sameSite: true });
    return res.status(200).send({ message: 'Вы успешно вошли', token });
  } catch (error) {
    return next(error);
  }
}

function createUser(req, res, next) {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;
  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    if (error) {
      throw error;
    }
    return userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => {
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        res.status(201).send(userWithoutPassword);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new ValidationError('Переданы некорректные данные при создании пользователя'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким E-mail уже создан'));
        }
        return next(err);
      });
  });
}

function readAllUsers(req, res, next) {
  return userModel.find()
    .then((users) => res.status(200).send(users))
    .catch(next);
}

function readUser(req, res, next) {
  const userId = req.params.id;
  return userModel.findById(userId)
    .then((user) => {
      if (!user || user.length === 0) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Переданы некорректные данные пользователя'));
      }
      return next(err);
    });
}

function patchProfile(req, res, next) {
  const { name, about } = req.body;
  return userModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user || user.length === 0) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
}

function patchAvatar(req, res, next) {
  const { avatar } = req.body;
  return userModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user || user.length === 0) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
}

module.exports = {
  readMe,
  login,
  readAllUsers,
  readUser,
  createUser,
  patchProfile,
  patchAvatar,
};
