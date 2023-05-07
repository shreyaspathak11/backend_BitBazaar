const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()   
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB', {
        useNewUrlParser: true, 
        useUnifiedTopology: true,   
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
})

//Model
const User = mongoose.model("User", userSchema)

//Routes
app.post("/register", (req, res) => {
    const { firstName, lastName, email, password} = req.body
    User.findOne({ email: email}, (err, user) => {
        if (user){
            res.status(500).send({message: "User already exists!"})
        }else{  
            const user = new User({ firstName, lastName, email, password})
            user.save(err => {
                if(err){
                    res.status(500).send(err)
                }else{
                    res.status(200).send({message: "Welcome to the BitBazaar Community!"})
                }
            })            
    }
    })
})

app.post("/login", (req, res) => {
    const { email, password} = req.body 
     User.findOne({ email: email}, (err, user) => {
        if (user){
            if(password === user.password){
                res.status(200).send({message: "Welcome to the BitBazaar Community!", user: user})
            }else{
                res.status(500).send({message: "Incorrect password!"})
            }
        } else {
            res.send({message: "User not registered!"})
        }
})
})

app.listen(4000, () => {
    console.log("Server is running on port 4000")
})   