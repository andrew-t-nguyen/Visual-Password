const zxcvbn = require("zxcvbn")

function validCheck(password) {


    const specialCharacters = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let validity = {
        upperCheck: false,
        lowerCheck: false,
        numCheck: false,
        specialCheck: false,
        lengthCheck: false,
        allowedCheck: true,
        result: false,
        strength: zxcvbn(password).score
    };

        if (password.length >= 10) validity.lengthCheck = true;

    for (i = 0; i < password.length; i++) {
        let c = password[i];

        //check upperCheck
        if (!validity.upperCheck) {
            if (c >= 'A' && c <= 'Z') {
                validity.upperCheck = true;
            }
        }

        //check lowerCheck
        if (!validity.lowerCheck) {
            if (c >= 'a' && c <= 'z') {
                validity.lowerCheck = true;
            }
        }

        if (!validity.numCheck) {
            if (c >= '0' && c <= '9') {
                validity.numCheck = true;
            }
        }

        if (!validity.specialCheck) {
            if (specialCharacters.includes(c)) {
                validity.specialCheck = true;
            }
        }

        if (validity.allowedCheck) {
            if (!charset.includes(c)) {
                validity.allowedCheck = false;
            }
        }
    }

    validity.result = validity.upperCheck && validity.lowerCheck && validity.numCheck && validity.specialCheck && validity.lengthCheck && validity.allowedCheck;

    return validity;
}


//checks if password is strong depending on how many guesses an online attacker will take for it to crack the password
function validatePassword(password) {
    
    let passValidity= validCheck(password);

    console.log("Inputted password: ", password, "\n");

    if(!passValidity.result) {
        console.log("Inputted password is not valid. \n");
        if (!passValidity.lengthCheck) console.log("Password is less than 10 characters long. \n");
        if (!passValidity.lowerCheck) console.log("Password does not contain at least 1 lowercase letter. \n");
        if (!passValidity.upperCheck) console.log("Password does not contain at least 1 uppercase letter. \n");
        if (!passValidity.numCheck) console.log("Password does not contain at least 1 number. \n");
        if (!passValidity.specialCheck) console.log("Password does not contain at least 1 allowed special character. \n");
        if (!passValidity.allowedCheck) console.log("Password contains non-allowed characters.\n");
        return;
    } else {
        console.log("Inputted password is valid. \n");
        console.log("Password score: ", passValidity.strength, "\n");
    }

}