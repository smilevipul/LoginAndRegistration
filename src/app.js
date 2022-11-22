const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");


require('./db/conn')

const Register = require("./models/registers");
const async = require("hbs/lib/async");

const port = process.env.PORT || 8080;

const static_path = path.join(__dirname,"../public");
const templete_path = path.join(__dirname,"../templetes/views");
const partials_path = path.join(__dirname,"../templetes/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",templete_path);
hbs.registerPartials(partials_path);


app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

//for login page geting
app.get("/login",(req,res)=>{
    res.render("login");
});


app.post("/register",async(req,res)=>{

    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword)
        {
            const RegisterData = new Register({
                name : req.body.name,
                gender : req.body.gender,
                age : req.body.age,
                email : req.body.email,
                password:req.body.password,
                cpassword:req.body.cpassword
            })
    
            const registered = await RegisterData.save();
            res.status(201).render("index");   
        }
        else{
            res.send("Passwords are not matching");
        }
         
    } catch (error) {
       res.status(400).send(error); 
    }
    
});


app.post("/login",async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail =await Register.findOne({email:email});

        if(useremail.password === password){
            
            res.status(201).render("index");
        }
        else{
            res.send("password are not matched");
        }

    } catch (error) {
        res.status(400).send("Invalid email And Password");
    }
});



app.listen(port , ()=>{
    console.log(`server is running at port : ${port}`);
})
  