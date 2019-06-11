const express = require('express');
const router = express.Router()
const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcrypt');
const saltRounds = 10;
const sequelize = require('sequelize');
const db = require('../config/config.json')
const cors = require('cors')
const models = require('../models')

require('dotenv').config()



const secretKey = process.env.SECRET_KEY
const expiresIn = '10h'


const User = require('../models/users')

models.sequelize.sync().then(function() {

    console.log('Nice! Database looks fine')

}).catch(function(err) {

    console.log(err, "Something went wrong with the Database Update!")

});


router.post('/singup',(req,res,next)=>{
    sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
    const formData = {
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
    }
    jwt.sign({formData},secretKey,{expiresIn},(err,token)=>{
        res.json({
            token
        })
    })
    bcrypt.hash(formData.password,saltRounds,function(err,hash){
        formData.password = hash
        db.User.create({
            name:req.body.name,
            email:req.body.email,
            password : hash,
        }).then(function(data){
            if(data){
                res.redirect('/home');
                res.send('signed up' + formData)

            }
        })

    })
    res.json({
        message: 'token bien recu',
        token:token
    })
})


router.post('/login',(req,res,next)=>{
    const formData = {
        name:req.body.name,
        password:req.body.password,
        email:req.body.email,
    }
    jwt.sign({formData},secretKey,{expiresIn},(err,token)=>{
        res.json({
            token
        })
    })
    db.User.findOne({
        where:{
            email:req.body.email
        }
    }).then(function(user){
    if(!user){
        res.redirect('/');
        res.send('User not found')
    } else {
        bcrypt.compare(req.body.password, user.password,function(err,result){
            if (result == true){
                res.redirect('/home');
            } else {
                res.send('Incorrect password');
                res.redirect('/')
            }
        })
    }
})
})


function verifytoken(req,res,next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
         const bearer = bearerHeader.split(' ')
         const bearerToken = bearer[1];
         req.token = bearerToken
         next();

    }else {
        //forbidden
        res.sendStatus(403)
    }

}

module.exports = router;
