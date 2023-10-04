require('dotenv').config()
// console.log(process.env.SECRET) 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const encrypt = require("mongoose-encryption");  //encrypt on save() and decrypt on find()

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({  extended: true })); 

mongoose.connect("mongodb://localhost:27017/levleOneDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secretKey =process.env.SECRET 
userSchema.plugin(encrypt,{secret:secretKey,encryptedFields:['password']}); // here we have applied the encryption on password field

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
 
  res.render("login");

});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save().then(function (data, err) {
    if (err) {
      console.log(err);
    } else {
      console.log("User Created");
      res.render("secrets");
    }
  });
});

app.post('/login',function(req,res){
  const emaIL = req.body.username
  const pass= req.body.password
  User.findOne({email:emaIL}).then(function(data,err){

    if(err){
      console.log(err);
    }
    else{
  const actPass =data 
  if(pass === data.password){
    console.log('Match found!');
    res.render('secrets')
  }
  else{
    console.log('password : '+ pass + ' Actual password : '+data.password);
  }
      
    }
  })
})

app.listen(3000, () => {
  console.log("Server started on Port 3000");
});
