require('./serverConfig/config');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { mongoose } = require('./database/mongooseData');
const { UrlData } = require('./models/url');
const port = process.env.PORT;

const app = express();

const urlRegex = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/main.html'));
});

app.get('/new/*', (req, res) => {
  let url = req.params[0];
  let hostUrl;
  if (!urlRegex.test(url)) {
    return res.send({ notice: 'You did not enter a valid url' });
  };

  if (port === '2000') {
    hostUrl = `http://localhost:${port}`;
  } else {
    hostUrl = 'https://url-microservice75.herokuapp.com';
  }

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
