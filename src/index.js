const express = require("express");
const path = require("path");
const collection = require("./config");



const app = express();
// convert data into json format
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.send('Create account successfully')
    }

});



// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User not found");
            return;
        }

        // Compare passwords (not hashed for simplicity - NOT RECOMMENDED)
        if (req.body.password !== check.password) {
            res.send("Incorrect password");
        } else {
            res.render("home");
        }
    } catch (error) {
        console.error("Error:", error);
        res.send("An error occurred while processing your request.");
    }
});




// Define Port for Application
const port = 5005;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});