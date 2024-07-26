const express = require("express");
const User = require('../models/User.js');
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get('/', function(req, res, next){
    console.log("render index webpage");
    try{
        res.render('index', {title: 'login'});
    }
    catch{
        next(err);
    }
});

router.post('/login', async function(req, res, next){
    try{
        let username = req.body.username;
        let password = req.body.password;
        let user = await User.findOne({username: username});
        if(user != null){
            bcrypt.compare(password, user.password, async function(err, result) {
                if(result == true){
                    //correct password, store username in session storage?
                    console.log("correct password");
                    res.status(200).send("Log in successful");
                }
                else{
                    //incorrect password
                    res.status(401).send("Incorrect password");
                }
            });
        }
        else{
            //user not found
            res.status(404).send("User not found");
        }
    }
    catch(err){
        next(err);
    }
});

router.post('/signup', async function(req, res, next){
    try{
        let username = req.body.username;
        let password = req.body.password;
        let user = await User.findOne({username: username});
        if(user == undefined){
            //new user
            bcrypt.hash(password, saltRounds, async function(err, hash) {
                //create new user
                let newUser = await User.create({username: username, password: hash, admin: false});
                res.status(200).send(newUser);
            });
        }
        else{
            //exisiting user -> can't sign up
            res.status(409).send("Username taken");
        }
    }
    catch{
        res.status(400).send("something went wrong")
    }
});

router.get('/users', async function(req, res, next){
    try{
        let users = await User.find();
        if(users != null){
            res.status(200).json(users);
        }
        else{
            res.status(404).send("Could not find any users, likely empty database")
        }
    }
    catch(err){
        res.status(500).send("something went wrong");
    }
});

router.get('/users/:username', async function(req, res, next){
    try{
        let user = await User.findOne({username:req.params.username});
        if(user != null){
            res.status(200).json(user);
        }
        else{
            res.status(404).send("Could not find user");
        }
    }
    catch(err){
        res.status(404).send("something went wrong");
    }
});

router.put('/users', async function(req, res, next){
    try{
        let user = await User.findOneAndUpdate({username:req.body.oldusername}, {username:req.body.newusername, balance:req.body.balance, admin:req.body.admin});
        if(user != null){
            res.status(200).send("Updated user");
        }
        else{
            res.status(404).send("Could not find user");
        }
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});

router.delete('/users/:username', async function(req, res, nect){
    try{
        let user = await User.findOneAndDelete({username:req.params.username});
        if(user != null){
            res.status(200).send("Deleted user");
        }
        else{
            res.status(404).send("Could not find user");
        }
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});

router.put('/users/:username/adjustbalance/:newbal', async function(req, res, next){
    try{
        let user = await User.findOneAndUpdate({username:req.params.username}, {balance:req.params.newbal});
        if(user != null){
            res.status(200).send("Updated user balance to: " + req.params.newbal);
        }
        else{
            res.status(404).send("Could not find user");
        }
    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;