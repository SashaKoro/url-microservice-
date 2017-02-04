const mongoose = require('mongoose');

process.env.MONGODB_URI = 'mongodb://localhost:27017/urls';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = { mongoose };
