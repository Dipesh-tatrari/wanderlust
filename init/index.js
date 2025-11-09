const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to DB");
})
.catch(err => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () =>{
    await Listing.deleteMany({});//we firstly clean the database by deleting the database by removing the unwanted data present in it
    initData.data = initData.data.map((obj)=>({...obj, owner: '690dc3b3249a2d74d8426692'}));//we are mapping through the data array present in the data.js file and creating new objects from it
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
