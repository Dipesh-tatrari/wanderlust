const express = require("express");
const router = express.Router();
//now each of the path is a route hence the app.get should be replaced by the router.get and so on the other paths

//
//Index route-user
router.get("/", (req,res)=>{//we are replacing /users with / because the common part in all can be replaced and used in the use section of server.js
    res.send("this is the index route");
})

//show route-user
router.get("/:id", (req,res)=>{
    res.send("Get for show users id");
})

//Post route-user
router.post("/", (req,res)=>{
    res.send("post for users");
})

//Delete route-user
router.delete("/:id", (req,res)=>{
    res.send("Delete for user id");
});

module.exports = router;//we will export the router object from this file