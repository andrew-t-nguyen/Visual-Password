const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require("bcrypt")
const session = require("express-session");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const app = express();
// convert data into json format
app.use(express.json());

app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
  }));

app.get("/", (req, res) => {
    res.render("main_login");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/visualsignup", (req, res) => {
    res.render("visualsignup");
});

app.get("/otp_ver", (req, res) => {
    res.render("otp_ver");
});

app.use(
    session({
        secret: "team14",
        resave: false,
        saveUninitialized: false
    })
);

//pls let me use someone else's email...
const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'peksonmichael@yahoo.com',
        pass: 'irtm xdnj jfcy ddvl'
    }
});

function generateVerificationCode(){
    return Math.floor(100000 + Math.random() * 900000);
}

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        email: req.body.user_email,
        password: req.body.password,
        secretKey: speakeasy.generateSecret().base32
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        const saltRounds = 13; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

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
            res.send("User name not found");
            return;
        }

        // Compare passwords 
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("Incorrect password");
        } else {
            const verificationCode = generateVerificationCode();
            req.session.verificationCode = verificationCode;

            const mailOptions = {
                from: 'peksonmichael@yahoo.com',
                to: check.email,
                subject: 'Verification Code for Login',
                text: `Your verification code is: ${verificationCode}`
            };

            await transporter.sendMail(mailOptions);
            res.redirect("/otp_ver");
        }
    } catch (error) {
        console.error("Error:", error);
        res.send("An error occurred while processing your request.");
    }
});

app.post("/main_login", async (req, res) => {
    try {
      const check = await collection.findOne({ name: req.body.username });
      if (!check) {
        return res.send("User name not found");
      }
  
      if (check.picturePassword && Array.isArray(check.picturePassword) && check.picturePassword.length > 0) {
        // User has a picture password
        const secretKey = 'secret-key'; // Use the same secret key used for encryption
  
        const decryptedPicturePassword = check.picturePassword.map(encryptedPassword => {
          const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
          return bytes.toString(CryptoJS.enc.Utf8);
        });
  
        // Store the decrypted picture password in the session or pass it as a query parameter
        req.session.decryptedPicturePassword = decryptedPicturePassword;
        req.session.username = check.name;
  
        return res.redirect("/visuallogin");
      } else {
        // User has a text-based password or no password
        return res.redirect("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing your request.");
    }
  });


app.post("/otp_ver", async (req, res) => {
    try {
        const submittedCode = req.body.otp;
        const storedCode = req.session.verificationCode;
        
        if(!submittedCode) { return res.send("There is no submitted code!"); }
        else if(!storedCode) { return res.send("There is no stored code!"); }
        else if(submittedCode != storedCode) { return res.send("Incorrect verification code"); }

        req.session.verificationCode = null;
        res.redirect("/home");
    } catch(error){
        console.error("Error:", error);
        res.send("An error occurred 2");
    }
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.post("/visualsignup", async (req, res) => {
    try {
      const selectedImageIds = req.body.selectedImageIds;
      //console.log('Selected Image IDs:', selectedImageIds);
      const secretKey = 'secret-key';

      const data = {
        name: req.body.username,
        email: req.body.user_email,
        picturePassword: [],
        secretKey: speakeasy.generateSecret().base32,
      };
  
      // Check if the username already exists in the database
      const existingUser = await collection.findOne({ name: data.name });
      if (existingUser) {
        res.send('User already exists. Please choose a different username.');
      } else {
        if (selectedImageIds) {
          // Convert the comma-separated string to an array
          const imageIdsArray = selectedImageIds.split(',');
  
          if (imageIdsArray.length === 6) {
            const encryptedPicturePassword = [];
          for (const element of imageIdsArray) {
            // Encrypt the element using AES with the secret key
            const encryptedPassword = CryptoJS.AES.encrypt(element, secretKey).toString();
            encryptedPicturePassword.push(encryptedPassword);
          }
          data.picturePassword = encryptedPicturePassword;

          } else {
            res.status(400).send('Please select exactly 6 images for the picture password.');
            return;
          }
        }
  
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        //console.log(data.picturePassword);
        res.send('Account created successfully');
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("An error occurred while processing your request.");
    }
  });

app.get("/visuallogin", async (req, res) => {
    const decryptedPicturePassword = req.session.decryptedPicturePassword;
  
    if (!decryptedPicturePassword || decryptedPicturePassword.length === 0) {
      return res.redirect("/");
    }
  
    const randomIndex = Math.floor(Math.random() * decryptedPicturePassword.length);
    const randomImageId = decryptedPicturePassword[randomIndex];
  
    res.render("visuallogin", { picturePassword: decryptedPicturePassword, randomImageId: randomImageId });
  });

app.post("/visuallogin", async (req, res) => {
    const selectedImageId = req.body.selectedImageId;
    const decryptedPicturePassword = req.session.decryptedPicturePassword;
  
    if (!decryptedPicturePassword || decryptedPicturePassword.length === 0) {
      return res.redirect("/");
    }
  
    const currentImageIndex = decryptedPicturePassword.indexOf(selectedImageId);
  
    if (currentImageIndex === -1) {
      // User selected the wrong image
      req.session.decryptedPicturePassword = []; // Clear the session
      return res.redirect("/");
    }
  
    decryptedPicturePassword.splice(currentImageIndex, 1); // Remove the correctly selected image ID
  
    if (decryptedPicturePassword.length === 0) {
      // User has successfully answered all image IDs
      try {
        // const check = await collection.findOne({ name: req.body.Username });
        // if (!check) {
        //   return res.send("User name not found");
        // }

        const username = req.session.username; // Retrieve the username from the session
         const user = await collection.findOne({ name: username });

        if (!user) {
          return res.send("User not found");
        }
  
        // Generate and send the verification code
        const verificationCode = generateVerificationCode();
        req.session.verificationCode = verificationCode;
        const mailOptions = {
          from: 'peksonmichael@yahoo.com',
          to: user.email,
          subject: 'Verification Code for Login',
          text: `Your verification code is: ${verificationCode}`
        };
        await transporter.sendMail(mailOptions);
  
        // Redirect to the OTP verification page
        return res.redirect("/otp_ver");
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("An error occurred while processing your request.");
      }
    }
  
    const randomIndex = Math.floor(Math.random() * decryptedPicturePassword.length);
    const randomImageId = decryptedPicturePassword[randomIndex];
  
    res.render("visuallogin", { picturePassword: decryptedPicturePassword, randomImageId: randomImageId });
  });

/*
// Define Port for Application
const port = 5005;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
*/


//stuff to make certifications workI
//only applicable when inside the amazon ec2 instance
const https = require('https');
const fs = require('fs');

// SSL certificate paths
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/t14cecs378lab3.shop/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/t14cecs378lab3.shop/cert.pem')
};

// Define Port for Application
const port = 443;

https.createServer(options, app).listen(port, () => {
    console.log(`Server listening on port ${port}`);
});