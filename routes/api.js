/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

module.exports = function (app) {

  const CONNECTION_STRING = process.env.DB;
  const client = new MongoClient(CONNECTION_STRING, {useNewUrlParser: true});
  const dbName = 'boards'
  
  app.route('/api/threads/:board')
    .post(function(req, res) {
      let board = req.params.board;
      
      client.connect((err) => {
        if (err) throw err;
        const db = client.db(dbName);
        const threads = db.collection(board);
        let data = {
          text: req.body.text,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false,
          delete_password: req.body.delete_password,
          replies: [],
          replycount: 0
        }
        threads.insertOne(data, (err, result) =>{
          if (err) throw err;

          res.redirect('/b/'+ board + '/')

        })

      })

    })
    .get((req, res) => {
      let board = req.params.board;

      client.connect(async function(err) {
        if (err) throw err;
        const db = client.db(dbName);
        const threads = db.collection(board);

        let docs = await threads.find({}).toArray();

        res.json(docs);
        
      })
    })
    .put((req, res) => {
      let board = req.params.board;

      client.connect(async function(err) {
        if (err) throw err;
        const db = client.db(dbName);
        const threads = db.collection(board);
        
        threads.updateOne({_id: ObjectId(req.body.report_id)}, {$set: {reported: true}}, (err, result) => {
          if (err) throw err;
          res.send('success')
        })
      })
    })
    .delete((req, res) => {
      let board = req.params.board;

      client.connect(function(err) {
        if (err) throw err;
        const db = client.db(dbName);
        const threads = db.collection(board);

        threads.remove({_id: ObjectId(req.body.thread_id), delete_password: req.body.delete_password}, (err, result) => {
          if (err) throw err;
 
          if (result.result.n === 0) res.send('incorrect password')
          else res.send('success')

        })
      })
    })
    
  app.route('/api/replies/:board')
  .post(function(req, res) {
    let board = req.params.board;
    let thread_id = req.body.thread_id
    
    client.connect((err) => {
      if (err) throw err;
      const db = client.db(dbName);
      const threads = db.collection(board);
      let data = {
        _id: new ObjectId(),
        text: req.body.text,
        created_on: new Date(),
        reported: false,
        delete_password: req.body.delete_password
      }
      
      threads.updateOne({_id: ObjectId(req.body.thread_id)}, {$set: {bumped_on: data.created_on}, $push: {replies: data}, $inc: {replycount: 1}}, (err, result) =>{
        if (err) throw err;
        res.redirect(`/b/${board}/?thread_id=${thread_id}/`)
      })
    })
  })

  .get(function(req, res) {
    let board = req.params.board;

    client.connect(async function(err) {
      if (err) throw err;
      const db = client.db(dbName);
      const threads = db.collection(board);

      let docs = await threads.find({_id: ObjectId(req.query.thread_id)}).toArray();
      res.json(docs[0]);
    })

  })
  .put((req, res) => {
    let board = req.params.board;

    client.connect(async function(err) {
      if (err) throw err;
      const db = client.db(dbName);
      const threads = db.collection(board);

      let docs = await threads.find({_id: ObjectId(req.body.thread_id)}).toArray();
      docs[0].replies.forEach(element => {
        if (element._id == req.body.reply_id) { element.reported = true }
      });
      threads.save(docs[0])
      res.send('success')
    })
  })
  .delete((req, res) => {
    let board = req.params.board;

    client.connect(async function(err) {
      if (err) throw err;
      const db = client.db(dbName);
      const threads = db.collection(board);

      let docs = await threads.find({_id: ObjectId(req.body.thread_id)}).toArray();
      docs[0].replies.forEach(element => {
        if (element._id == req.body.reply_id) {
          if (element.delete_password == req.body.delete_password) {
            element.text = '[deleted]'

            threads.save(docs[0])
            res.send('success')
          } else res.send('incorrect password')
        }
      })
    })
  })
};
