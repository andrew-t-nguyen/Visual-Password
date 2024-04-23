// show password toggler
let showPasswordBtn = document.querySelector('.show-password');
let passwordInp = document.getElementById('password');

showPasswordBtn.addEventListener('click', () => {
    showPasswordBtn.classList.toggle('fa-eye');
    showPasswordBtn.classList.toggle('fa-eye-slash');
    passwordInp.type = passwordInp.type === 'password' ? 'text' : 'password'; // Toggle password visibility
});


// Function to generate a random password
function generatePassword(length = 100) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
}

document.getElementById("generate-password").addEventListener("click", function() {
    const newPassword = generatePassword();
    document.getElementById("password").value = newPassword;
    
    // Manually trigger the 'input' event on the password input field
    const passwordInput = document.getElementById('password');
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    passwordInput.dispatchEvent(inputEvent);
});
