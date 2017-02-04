const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { mongoose } = require('./database/mongooseData');
const { UrlData } = require('./models/url');
const port = process.env.PORT || 2000;

const app = express();
let hostUrl = 'http://localhost:2000';
const urlRegex = /https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/new/*', (req, res) => {
  let url = req.params[0];
  if (!urlRegex.test(url)) {
    return res.send({ notice: 'You did not enter a valid url' });
  };

  let urlData = new UrlData({
    originalurl: req.params[0],
  });
  urlData.save().then((data) => {
    res.send({
      originalurl: data.originalurl,
      shorturl: `${hostUrl}/${data._id}`
    });
  }, (error) => {
    res.status(400).send(error);
  });
});

app.get('/:id', (req, res) => {
  let id = req.params.id;

  UrlData.findById(id).then((data) => {
    res.redirect(data.originalurl);
  }, (error) => {
    res.status(404).send({ notice: 'There is no url in the database for that ID' });
  });
});

app.listen(port, () => {
  console.log(`Running app on port ${port}`);
});

module.exports = { app };
