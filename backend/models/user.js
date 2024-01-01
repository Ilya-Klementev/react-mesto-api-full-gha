const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: [2, 'Минимальная длина поля "Имя"- 2'],
      maxLength: [30, 'Максимальная длина поля "Имя"- 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: [2, 'Минимальная длина поля "О себе"- 2'],
      maxLength: [30, 'Максимальная длина поля "О себе"- 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => validator.isURL(v),
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v) => validator.isEmail(v),
      },
      unique: true,
      dropDups: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
