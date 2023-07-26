require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/users.model')

const app = express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port = process.env.port || 5000;
const dbURL = process.env.mongo_url;
const intialDbConnection = async () => {
    try {
      await mongoose.connect(dbURL)
      console.log("db connected")
    }
    catch (error) {
      console.error(error);
    }
  }


app.get("", (req, res)=>{
    res.sendFile(__dirname + "/./views/index.html");
})

app.post("/register", async (req, res)=>{

    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

app.post("/login", async (req, res)=>{
    try {
        const {email, password} = new User(req.body);
        const user = await User.findOne({email});
        if (user && user.password === password) {
            res.status(200).json({status: "valid user"})
        }else{
            console.log('user not found');
            res.status(400).json({status: "Invalid user"})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
})

app.use((req, res, next)=>{
    res.status(404).json({
        message: "route not found!",
    })
})

app.use((err, req, res, next)=>{
    res.status(500).json({
        message: "Something broke!",
    })
})

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
    intialDbConnection()
})



