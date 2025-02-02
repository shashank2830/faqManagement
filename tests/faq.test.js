const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); // Ensure the server is exported correctly

chai.use(chaiHttp);
const { expect } = chai;

describe('FAQ API Tests', () => {
  it('should create a new FAQ', (done) => {
    chai.request(app)
      .post('/faq')
      .send({
        question: 'What is Express?',
        answer: 'Express is a web framework for Node.js'
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('question', 'What is Express?');
        done();
      });
  });

  it('should fetch all FAQs', (done) => {
    chai.request(app)
      .get('/faq')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should return a translated FAQ', (done) => {
    chai.request(app)
      .get('/faq?lang=hi') // Testing Hindi translation
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body[0]).to.have.property('question'); // Ensure translated field exists
        done();
      });
  });
});
