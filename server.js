'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const SHA256 = require("crypto-js/sha256")
const jwt = require('jsonwebtoken');
const {expressjwt} = require("express-jwt");
const mongoose = require('mongoose');

const port = 3000

const secret = '12344567'

const uri = "mongodb+srv://####:####@#####.dfh4zhb.mongodb.net/?retryWrites=true&w=majority&appName=Experiment";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const Schema = mongoose.Schema;

const new_user = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  token: String
});

const NewUser = mongoose.model('NewUser', new_user);

app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(express.static('public'));

app.use(
  expressjwt({
    secret: secret,
    algorithms: ["HS256"],
  }).unless({ path: 
    [
      '/',
      '/favicon.ico',
      '/login',
      '/subscribe',
      '/dashboard',
    ] })
);

app.get('/', (req, res) => {
  res.render('login')
})

app.get('/dashboard', (req, res) => {
  res.render('dashboard')
})

app.post('/login', async (req, res, next) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const encrypted_password = SHA256(password)
    const user = await NewUser.findOne({
      email: email,
      password: encrypted_password
    })

    if (!user) {
      const error = new Error
      error.status = 401
      error.message = 'Les identifiants son incorrects'
      throw error
    }
    
    res.json({token: user.token})
  }
  catch (err) {
    next(err)
  }
})

app.get('/subscribe', async (req, res, next) => {
  try {
    res.render('subscribe')
  }
  catch (err) {
    next(err)
  }
})

app.post('/subscribe', async (req, res, next) => {
  try {
    const password = req.body.password;
    const create_token = await jwt.sign({role: 'user'}, secret)
    const token = await create_token
    const new_user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: SHA256(password),
      token: token
    }
    const user = new NewUser(new_user);

    await user.save()
    res.json({token: token})
  }
  catch (err) {
    next(err)
  }
})

app.get('/user_data', async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const user = await NewUser.findOne({token: token})
    const user_data = {
      first_name: user.first_name,
      last_name: user.last_name
    }
    res.json(user_data)
  }
  catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({message: err.message, status: err.status});
});

app.listen(port, async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    console.log(`Example app listening on port ${port}`)
  }
  catch (err) {
    process.exit(1);
  }
})