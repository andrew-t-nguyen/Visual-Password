const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://team14:team14@atlascluster.xcpdp2l.mongodb.net/");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true  
    },
    password: {
        type: String,
        required: false 
        
    },
    picturePassword: {
        type: [String],
        require:false,
    },

    secretKey: String
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;