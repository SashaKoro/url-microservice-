const mongoose = require('mongoose');

const UrlData = mongoose.model('urls', {
  originalurl: {
    type: String,
    required: true
  }
});

module.exports = { UrlData };
