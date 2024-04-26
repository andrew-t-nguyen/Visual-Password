const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");

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

// Middleware to validate picturePassword length before saving
// Loginschema.pre('save', function(next) {
//     if (this.picturePassword && this.picturePassword.length !== 6) {
//         const err = new Error('You must provide exactly 6 picture IDs.');
//         return next(err);
//     }
//     next();
// });

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;