const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
//this plugin will add username and password fields to the schema and also will hash and salt the password and store the hashed password in the database
//it also adds some methods to the schema like authenticate, serializeUser and deserializeUser
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
});

userSchema.plugin(passportLocalMongoose);
//this will add the username and password fields to the userSchema
module.exports = mongoose.model("User", userSchema);