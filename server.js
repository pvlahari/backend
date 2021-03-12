
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const port = 4000;
let users = require('./models/user');

app.use(bodyparser.json());
app.use(cors());
app.use(bodyparser.urlencoded({
    extended: false
  })
);

let Users = require('./routes/users');
app.use('/users', Users);

Users.route('/').get(function(req, res) {
    users.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        } 
    });
});

const url = 'mongodb://localhost:27017/Project';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true } )
const connection = mongoose.connection;

connection.once('open', function () {
    console.log('connection established successfully..!');
})

app.listen(port, function () {
    console.log(`server running at ${port}`);
});
