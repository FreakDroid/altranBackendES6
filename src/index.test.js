import http from 'http';
import assert from 'assert';
import chai from 'chai';
import chaiHttp  from 'chai-http';
import cheerio from 'cheerio';
import request from 'supertest';

let server = request.agent('http://localhost:5050');

chai.use(chaiHttp);
chai.should();
const exp = chai.expect;


let cookie;

describe('Base server', function() {
  this.timeout(15000);

  //Test about my server is running correctly
  it('should go up local server', function (done) {
    server
    .post('/login').end(function(err, res){
      res.should.have.status(302);
      exp(res).to.redirectTo('/login');
      done();
    });
  });

  it('should return not Autorized', function (done) {
    server.post('/home').end(function(err, res){
      res.should.have.status(404);
      done();
    });
  });

  it('should wrong username', function(done) {
    server
    .post('/login')
    .send({ username: 'britney', password: '1234' })
    .expect(302)
    .expect('Location', '/login')
    .end(function(err, res) {
      done();
    });
  });

  it('should wrong password', function(done) {
    server
    .post('/login')
    .send({ username: 'britneyblankenship@quotezart.com', password: '1234567765665' })
    .expect(302)
    .expect('Location', '/login')
    .end(function(err, res) {
      done();
    });
  });



  it('should redirect to home on successful login', function(done) {
    server
    .post('/login')
    .send({ username: 'britneyblankenship@quotezart.com', password: '1234' })
    .end(function(err, res) {
      res.should.have.status(302);
      done();
    });
  });
});


describe('Apis Routes User', function(){
this.timeout(15000);

it('Should post to user/name/:name', function(done){
  const user = { id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
                name: 'Britney',
                email: 'britneyblankenship@quotezart.com',
                role: 'admin' 
  } ;
  server
    .get('/user/name/'+ user.name)
    .end((err, res) => {
        res.should.have.status(200);

        exp(res).to.be.a('object');

        let $ = cheerio.load(res.text);
        let textid = $('#textid').val();
        let textName = $('#textName').val();
        let textEmail = $('#textEmail').val();
        let textRole = $('#textRole').val();

        exp(textid).to.have.equal(user.id);
        exp(textName).to.have.equal(user.name);
        exp(textEmail).to.have.equal(user.email);
        exp(textRole).to.have.equal(user.role);
        done();
      });
});

  it('Should post to user/name/:name with error, user doesn\'t exit', function(done){
    const errorMessage = "User doesn't exist";
    server
      .get('/user/name/Realshd')
      .end((err, res) => {
          res.should.have.status(200);
          let $ = cheerio.load(res.text);
          let errorDiv = $('#errorDiv').text();
          exp(errorDiv).to.have.equal(errorMessage);
          done();
        });
  });


  it('Should post to user/id/:id', function(done){
    const user = { id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
                  name: 'Britney',
                  email: 'britneyblankenship@quotezart.com',
                  role: 'admin' 
    } ;
    server
      .get('/user/id/' + user.id)
      .end((err, res) => {
          res.should.have.status(200);

          exp(res).to.be.a('object');

          let $ = cheerio.load(res.text);
          let textid = $('#textid').val();
          let textName = $('#textName').val();
          let textEmail = $('#textEmail').val();
          let textRole = $('#textRole').val();

          exp(textid).to.have.equal(user.id);
          exp(textName).to.have.equal(user.name);
          exp(textEmail).to.have.equal(user.email);
          exp(textRole).to.have.equal(user.role);
          done();
        });
  });

  it('Should post to user/id/:id with error, user doesn\'t exit', function(done){
    const errorMessage = "User doesn't exist";
    server
      .get('/user/id/31232321322132')
      .end((err, res) => {
          res.should.have.status(200);
          let $ = cheerio.load(res.text);
          let errorDiv = $('#errorDiv').text();
          exp(errorDiv).to.have.equal(errorMessage);
          done();
        });
  });
});


describe('Apis Routes Policy', function(){
  this.timeout(25000);
  it('Should post to /policies/name/:name', function(done){
    const user = { id: 'a0ece5db-cd14-4f21-812f-966633e7be86',
                  name: 'Britney',
                  email: 'britneyblankenship@quotezart.com',
                  role: 'admin' 
    } ;
    server
      .get('/policies/name/'+ user.name)
      .end((err, res) => {
          res.should.have.status(200);

          exp(res).to.be.a('object');

          let $ = cheerio.load(res.text);
          let textId = $('#textId').val();
          let textName = $('#textName').val();
          let textEmail = $('#textEmail').val();
          let textPolicies = $('#textPolicies').val();

          exp(textId).to.have.equal(user.id);
          exp(textName).to.have.equal(user.name);
          exp(textEmail).to.have.equal(user.email);
          exp(textPolicies).to.have.equal('102');
          done();
        });
  });

  it('Should post to /policies/name/:name with error, user doesn\'t exit', function(done){
    const errorMessage = "User doesn't exist";
    server
      .get('/policies/name/Realshd')
      .end((err, res) => {
          res.should.have.status(200);
          let $ = cheerio.load(res.text);
          let errorDiv = $('#errorDiv').text();
          exp(errorDiv).to.have.equal(errorMessage);
          done();
        });
  });

  it('Should post to /policies/id/:name', function(done){
    const policy = { id: '64cceef9-3a01-49ae-a23b-3761b604800b'} ;
    server
      .get('/user/policeId/'+ policy.id)
      .end((err, res) => {
          res.should.have.status(200);

          exp(res).to.be.a('object');
          done();
        });
  });

  it('Should post to /policies/name/:name with error, user doesn\'t exit', function(done){
    const errorMessage = "Policies doesn't exist";
    server
      .get('/user/policeId/2243243')
      .end((err, res) => {
          res.should.have.status(200);
          let $ = cheerio.load(res.text);
          let errorDiv = $('#errorDiv').text();
          exp(errorDiv).to.have.equal(errorMessage);
          done();
        });
  });

});