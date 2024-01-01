const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors, celebrate } = require('celebrate');

const { PORT, DB_URL } = process.env;
const mongoose = require('mongoose');

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
});
const { requestLogger, errorLogger } = require('./middlewares/logger');
const middlewareAuth = require('./middlewares/auth');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const userController = require('./controllers/users');
const { handleError } = require('./middlewares/errors/handleError');
const NotFoundError = require('./middlewares/errors/NotFoundError');
const { validationRequestSignin, validationRequestSignup } = require('./middlewares/validationRequest');
const { cors } = require('./middlewares/cors');

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(limiter);
app.use(cors);

mongoose.connect(DB_URL)
  .then(() => {
    console.log('mongoDB connected');
  });

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate(validationRequestSignin), userController.login);
app.post('/signup', celebrate(validationRequestSignup), userController.createUser);

app.use(middlewareAuth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use((req, res, next) => next(new NotFoundError('Запрашиваемая страница не найдена')));

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
