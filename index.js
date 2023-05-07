import express from "express"
import mongoose from "mongoose"
import cors from "cors"

const app = express()   
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

mongoose.connect('mongodb://127.0.0.1:27017/myLoginRegisterDB', {
        useNewUrlParser: true,    
}, () => {
    console.log("Database connected")
})

//Routes
app.get("/", (req, res) => {
    res.send("Welcome to the server")
})

app.listen(4000, () => {
    console.log("Server is running on port 4000")
})   