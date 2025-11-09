const express = require("express");
const app = express();
const user = require("./user.js");

app.get("/getcookies", (req, res)=>{
    res.cookie("greet", "hello");
    res.send("sent you some cookies");//we send cookies in "name, value"
})

app.use("/users",user);//we are using "/" as it will compare all the path in user file with the / and after that it will respond

//posts
//Index route
app.get("/posts", (req,res)=>{
    res.send("this is the index route for post");
})

//show route
app.get("/posts/:id", (req,res)=>{
    res.send("Get for show post id");
})

//Post route
app.post("/posts", (req,res)=>{
    res.send("post for posts");
})

//Delete route
app.delete("/posts/:id", (req,res)=>{
    res.send("Delete for post id");
})
app.listen(3000, (req,res)=>{
    console.log("root is working");
})