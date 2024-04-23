
<<<<<<< HEAD

// Function to generate a random password
function generatePassword(length = 100) {
=======
// Function to generate a random password
function generatePassword(length = 20) {
>>>>>>> 3c320846fcd2d7dea16e065fb36c10b8ab1654eb
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

document.getElementById("generate-password").addEventListener("click", function() {
    document.getElementById("password").value = generatePassword();
<<<<<<< HEAD
});
=======
});

>>>>>>> 3c320846fcd2d7dea16e065fb36c10b8ab1654eb
