module.exports = function (req, res, next) {
  if (!res.locals.token.isAdmin)
    return res.status(403).send('Access forbidden.');
  next();
};
