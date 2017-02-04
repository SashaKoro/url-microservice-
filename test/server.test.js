const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { UrlData } = require('./../models/url');

const dummyData = [{
  _id: new ObjectID(),
  originalurl: 'https://www.nba.com',
  shorturl: `http://localhost:2000/${this._id}`,
}];

console.log(dummyData[0]._id);

beforeEach((done) => {
  UrlData.remove({}).then(() => {
    return UrlData.insertMany(dummyData);
  }).then(() => done());
});

const validUrl = 'https://www.nfl.com';
const badUrl = 'htp://www.nbcom';

describe('GET /new/url', (req, res) => {
  it('should create a new url data point if url is valid', (done) => {
    request(app)
      .get(`/new/${validUrl}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.originalurl).toBe(validUrl);
        expect(res.body.shorturl).toExist();
      })
      .end(done);
  });

  it('should inform user of error if url is invalid', (done) => {
    request(app)
      .get(`/new/${badUrl}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.notice).toBe('You did not enter a valid url');
      })
      .end(done);
  });
});

describe('GET /id:', (req, res) => {
  it('should fetch correct data from id parameter', (done) => {
    request(app)
      .get(`/${dummyData[0]._id}`)
      .expect((res) => {
        expect(res.body.originalurl).toBe(dummyData.originalurl)
      })
      .end(done);
  });
  it('should inform user if id could not be found', (done) => {
    request(app)
      .get('/12345')
      .expect((res) => {
        expect(res.body.notice).toBe('There is no url in the database for that ID');
      })
      .end(done);
  });
});
