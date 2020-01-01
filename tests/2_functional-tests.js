/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('#example Test POST /api/threads/testboard2', function(done){
        chai.request(server)
         .post('/api/threads/testboard2')
         .send({
           text: 'testboard2',
           delete_password: 'testboard2'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     });

    });
    
    suite('GET', function() {

      test('#example Test GET /api/threads/testboard', function(done){
        chai.request(server)
         .get('/api/threads/testboard')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.property(res.body[0], 'text', 'Threads in array should contain text');
           assert.property(res.body[0], 'replycount', 'Threads in array should contain replycount');
           assert.property(res.body[0], '_id', 'Threads in array should contain _id');
           done();
         });
     });
      
    });
    
    suite('DELETE', function() {
      test('#example Test DELETE /api/threads/testboard2', function(done){
        chai.request(server)
         .delete('/api/threads/testboard2')
         .send({
           thread_id: 'testboard212',
           delete_password: 'testboard2'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     });
      
    });
    
    suite('PUT', function() {
      test('#example Test PUT /api/threads/testboard2', function(done){
        chai.request(server)
         .put('/api/threads/testboard2')
         .send({
           thread_id: 'testboard212'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     });
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('#example Test POST /api/replies/testboard2', function(done){
        chai.request(server)
         .post('/api/threads/testboard2')
         .send({
           thread_id: 'testboard212',
           text: 'testreply212',
           delete_password: 'testreply212'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     }); 
    
    });
    
    suite('GET', function() {
      test('#example Test GET /api/replies/testboard2', function(done){
        chai.request(server)
         .get('/api/threads/testboard2?thread_id=testreply212')
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
      
    });
    
    suite('PUT', function() {
      test('#example Test PUT /api/replies/testboard2', function(done){
        chai.request(server)
         .put('/api/threads/testboard2')
         .send({
           thread_id: 'testboard212',
           reply_id: 'testreply212'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     });
      
    });
    
    suite('DELETE', function() {
      test('#example Test DELETE /api/replies/testboard2', function(done){
        chai.request(server)
         .delete('/api/threads/testboard2')
         .send({
           thread_id: 'testboard212',
           reply_id: 'testreply212',
           delete_password: 'testreply212'
         })
         .end(function(err, res){
           assert.equal(res.status, 200);
           done();
         });
     });
      
    });
    
  });

})})
