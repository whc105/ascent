module.exports = {
  PORT: process.env.PORT || 8080,
  keys: process.env.NODE_ENV === 'production' ? require('./.prodKeys') : require('./.devKeys')
};