
const express = require('express');
const users = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const paginate = require('jw-paginate');

const User = require('../models/user');
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
    const today = new Date();

    const userData = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        city: req.body.city,
        role: req.body.role,
        created: today
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData).then(user => {
                    res.status(200).json({status: user.email + ' ' +  'is successfully registered..!'})    
                }).catch(err => {
                    res.status(400).res.send('error: ' + err)
                })
            })
        } else {
            res.status(400).json({error: 'user already exists.!'})
        }
    }).catch(err => {
        res.send('error: ' + err)
    })
})

users.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {            
            if (bcrypt.compareSync(req.body.password, user.password)) {

                // let role = user.findById(user.email, function(req, user) {
                //     res.send(user.role);
                // })

                const payload = {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                }) 

                let sendData = {
                    token: token,
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    city: user.city,
                    role: user.role,
                }

                res.status(200).json(sendData);
               //res.status(200).send({user, token});
            } else {
                res.status(400).json({error: "wrong credentials.!"});
            }
        } else {
            res.status(400).json({error: "wrong credentials.!"});
        }
    }).catch(err => {
        res.send('error: ' + err)
    })
})

users.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, function(req, user) {
        res.json(user);
    })
})

users.post('/update/:id', (req, res) => {
    User.findById(req.params.id, function(err, user) {
        if(!user) 
            res.status(404).send('data not found');
        else    
            user.username = req.body.username;    
            user.email = req.body.email;    
            user.city = req.body.city;
            
        user.save().then(user => { res.json('user updated') })        
        .catch(err => { res.status(400).send('update failed..!') })   
    });
});

users.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

// users.get('/edit', (req, res) => {
//     let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
//     User.findOne({
//         _id: decoded._id
//     })
//     .then(user => {
//         if (user) {
//             res.status(200).json(user) 
//         } else {
//             res.status(400).json({error: "user doesn't exists"})
//         }
//     }) 
//     .catch(err => {
//         res.status(400).send('error: ' + err)
//     })
// })

module.exports = users;