"use strict";

var express = require("express");

var mongoose = require("mongoose");

var cors = require("cors");

var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return console.log("MongoDB connected");
})["catch"](function (err) {
  return console.log(err);
});
var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
}); //Model

var User = mongoose.model("User", userSchema); //Routes

app.post("/register", function (req, res) {
  var _req$body = req.body,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      email = _req$body.email,
      password = _req$body.password;
  User.findOne({
    email: email
  }, function (err, user) {
    if (user) {
      res.status(500).send({
        message: "User already exists!"
      });
    } else {
      var _user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      });

      _user.save(function (err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).send({
            message: "Welcome to the BitBazaar Community!"
          });
        }
      });
    }
  });
});
app.post("/login", function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;
  User.findOne({
    email: email
  }, function (err, user) {
    if (user) {
      if (password === user.password) {
        res.status(200).send({
          message: "Welcome to the BitBazaar Community!",
          user: user
        });
      } else {
        res.status(500).send({
          message: "Incorrect password!"
        });
      }
    } else {
      res.send({
        message: "User not registered!"
      });
    }
  });
});
app.listen(4000, function () {
  console.log("Server is running on port 4000");
});