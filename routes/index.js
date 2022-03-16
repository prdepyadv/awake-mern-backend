const express = require('express');
const router = express.Router();
const User = require('../models/users');
const config = require('../helpers/global')
var multer = require('multer')();

router.post('/register', multer.any(), function (req, res) {
   if(req.body == undefined){
      res.send({'error': true, 'message': 'Empty request'});
   }
   try{
      let username = req.body.username, password = req.body.password, email = req.body.email;
      if(!username || !password || !email){
         return res.send({'error': true, 'message': 'Invalid request'});
      }
      const newUser = new User({
         username: username,
         password: password,
         email: email
      });
      newUser.save().then(() => res.send(
         {'error': false, 'message': 'User Added!', 'data': newUser}
      ));
   } catch (err){
      res.send({'error': true, 'message': err.message});
   }
});

router.post('/login', multer.any(), function (req, res) {
   console.log(req);
   if(req.body == undefined){
      res.send({'error': true, 'message': 'Empty request'});
   }
   try{
      let username = req.body.username, password = req.body.password;
      if(!username || !password){
         return res.send({'error': true, 'message': 'Invalid request'});
      }
      User.findOne({"username_lower": username.toLowerCase(), 'password': password},
       'username email token', (err, data) => {
         if (err) {
            return res.send({'error': true, 'message': err.message});
         } else if(!data || data.length === 0){
            return res.send({'error': true, 'message': 'User not found'});
         } else {
            data.token = config.generateAccessToken(data);
            data.save((err, data) => {
               if(err) {
                  return res.send({'error': true, 'message': err.message});
               } else {
                  return res.send({'error': false, 'data': data});
               }
            });
         }
      });
   } catch (err){
      return res.send({'error': true, 'message': err.message});
   }
});

router.use(config.authenticateToken); //applying this middleware in all the below routes

router.get('/users', function (req, res) {
   User.find({}, 'username email', (err, data) => {
        if (err) res.send({'error': true, 'message': err.message});
        res.send(data);
    })
});

router.get('/user/:user_id', function (req, res) {
   User.findOne({'_id': req.params.user_id}, 'username email', (err, data) => {
        if (err) {
           console.log(err);
           return res.status(404).send({'error': true, 'message': 'Not Found'});
        } else {
           return res.send(data);
        }
    })
});

module.exports = router;