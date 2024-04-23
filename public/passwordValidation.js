//checklist show when click on password input
const passwordInput = document.getElementById('password');
const passwordChecklist = document.querySelector('.password-checklist');


// Add event listener for the focus event on the password input
passwordInput.addEventListener('input', function() {
    // Add the 'show-checklist' class to display the checklist
    passwordChecklist.classList.add('show-checklist');
});

// Add event listener for the blur event on the password input
passwordInput.addEventListener('blur', function() {
    // Check if the password input value is empty
    if (passwordInput.value === '') {
        // Remove the 'show-checklist' class to hide the checklist
        passwordChecklist.classList.remove('show-checklist');
    }
});

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
        //strength: zxcvbn(password).score
    };

    if (password.length >= 10) validity.lengthCheck = true;

    for (let i = 0; i < password.length; i++) {
        let c = password[i];

        // Check upper case
        if (!validity.upperCheck && c >= 'A' && c <= 'Z') {
            validity.upperCheck = true;
        }

        // Check lower case
        if (!validity.lowerCheck && c >= 'a' && c <= 'z') {
            validity.lowerCheck = true;
        }

        // Check number
        if (!validity.numCheck && c >= '0' && c <= '9') {
            validity.numCheck = true;
        }

        // Check special characters
        if (!validity.specialCheck && specialCharacters.includes(c)) {
            validity.specialCheck = true;
        }

        // Check allowed characters
        if (validity.allowedCheck && !charset.includes(c)) {
            validity.allowedCheck = false;
        }
    }

    return validity;
}

passwordInput.addEventListener('input', () => { // Use 'input' event for real-time updates
    const password = passwordInput.value;
    const validity = validCheck(password);
    
    // Update checklist based on validity checks
    let checklistItems = passwordChecklist.querySelectorAll('.list-item');
    checklistItems[0].classList.toggle('checked', validity.lengthCheck);
    checklistItems[1].classList.toggle('checked', validity.upperCheck);
    checklistItems[2].classList.toggle('checked', validity.lowerCheck);
    checklistItems[3].classList.toggle('checked', validity.numCheck);
    checklistItems[4].classList.toggle('checked', validity.specialCheck);
});

// prevent unqualified sign up
document.getElementById('signup-form').addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    const passwordValidity = validCheck(password);

    // Check if any of the validity conditions are not met
    if (!passwordValidity.upperCheck || !passwordValidity.lowerCheck || !passwordValidity.numCheck || !passwordValidity.specialCheck || !passwordValidity.lengthCheck) {
        // Prevent form submission
        event.preventDefault();

        // Display error message to the user
        document.getElementById('password-error').textContent = 'Password does not meet the requirements. Please choose another password.';
    }
});




