"use strict";

var express = require('express');

var cors = require('cors');

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var User = require('./models/user.model');

var Member = require('./models/newsletter.model');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var app = express();
app.use(bodyParser.json({
  limit: '30mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '30mb',
  extended: true
}));
app.use(cors());
var CONNECTION_URL = 'mongodb+srv://dummy123:dummy123@bitbazaar.imeimd6.mongodb.net/';
var PORT = process.env.PORT || 5000;
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  return app.listen(PORT, function () {
    return console.log("Server Running on Port: http://localhost:".concat(PORT));
  });
})["catch"](function (error) {
  return console.log("".concat(error, " did not connect"));
});
app.post('/api/register', function _callee(req, res) {
  var newPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 4:
          newPassword = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: newPassword
          }));

        case 7:
          res.json({
            status: 'ok'
          });
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          res.json({
            status: 'error',
            error: 'Duplicate email'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
app.post('/api/login', function _callee2(req, res) {
  var user, isPasswordValid, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 2:
          user = _context2.sent;

          if (user) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", {
            status: 'error',
            error: 'Invalid login'
          });

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 7:
          isPasswordValid = _context2.sent;

          if (!isPasswordValid) {
            _context2.next = 13;
            break;
          }

          token = jwt.sign({
            name: user.name,
            email: user.email
          }, 'secret123');
          return _context2.abrupt("return", res.json({
            status: 'ok',
            user: token
          }));

        case 13:
          return _context2.abrupt("return", res.json({
            status: 'error',
            user: false
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post('/api/newsletter', function _callee3(req, res) {
  var newMember;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body);
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Member.create({
            email: req.body.email
          }));

        case 4:
          newMember = _context3.sent;
          res.json({
            status: 'ok'
          });
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          res.json({
            status: 'error',
            error: 'Duplicate email'
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
});