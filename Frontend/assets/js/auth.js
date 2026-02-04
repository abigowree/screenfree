const API_URL = "http://localhost:8000"; // Update port if necessary

// ========== Validation Functions ==========

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Validate password strength (minimum 6 characters)
function isValidPassword(password) {
    return password.length >= 6;
}

// Validate name (minimum 2 characters, only letters and spaces)
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
}

// Show validation error message
function showError(message) {
    alert(message);
}

// ========== Registration ==========

async function registerUser(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm').value;

    // Validate full name
    if (!fullName) {
        showError("Please enter your full name");
        return;
    }
    if (!isValidName(fullName)) {
        showError("Please enter a valid name (at least 2 characters, letters only)");
        return;
    }

    // Validate email
    if (!email) {
        showError("Please enter your email address");
        return;
    }
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address (e.g., example@gmail.com)");
        return;
    }

    // Validate password
    if (!password) {
        showError("Please enter a password");
        return;
    }
    if (!isValidPassword(password)) {
        showError("Password must be at least 6 characters long");
        return;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
        showError("Passwords do not match");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                password: password,
                confirm_password: confirmPassword
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        } else {
            alert(data.detail || "Registration failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during registration: " + error.message);
    }
}

// ========== Login ==========

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate email
    if (!email) {
        showError("Please enter your email address");
        return;
    }
    if (!isValidEmail(email)) {
        showError("Please enter a valid email address (e.g., example@gmail.com)");
        return;
    }

    // Validate password
    if (!password) {
        showError("Please enter your password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            // Store token and user info
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', data.user_id);

            alert("Login successful!");
            window.location.href = "../../index.html"; // Redirect to home page
        } else {
            alert(data.detail || "Login failed");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during login: " + error.message);
    }
}

// ========== Event Listeners ==========

// Attach event listener to the form itself, not the button
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Determine if this is the registration form or login form
            // We check for the 'confirm' password field which is only in registration
            const confirmField = document.getElementById('confirm');
            if (confirmField) {
                registerUser(e);
            } else {
                loginUser(e);
            }
        });
    });
});
