const cors = (req, res, next) => {
  const allowedCors = [
    'https://praktikum.tk',
    'http://praktikum.tk',
    'localhost:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    /(https|http)?:\/\/(?:www\.|(?!www))mesto-front.nomoredomainsmonster.ru\/[a-z]+\/|[a-z]+\/|[a-z]+(\/|)/,
  ];

  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = { cors };
