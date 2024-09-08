const API_URL = 'http://localhost:5000/api';  // Backend API URL


function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleMessage = document.getElementById('toggle-message');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        toggleMessage.textContent = "Don't have an account? Register here";
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        toggleMessage.textContent = "Already have an account? Login here";
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            // If the response is not okay, throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        // Parse the JSON data from the response
        const data = await response.json(); // Ensure this is defined correctly
        console.log('Login successful:', data);

        // Store the token (if received) in localStorage or sessionStorage
        localStorage.setItem('token', data.token);

        // Redirect the user or update the UI
        window.location.href = 'index.html';
    } catch (error) {
        // Handle network or unexpected errors
        console.error('Login error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
        document.getElementById('error-message').style.display = 'block';
    }
}

async function register() {
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    try {
        // Replace with your actual API endpoint
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });

        const result = await response.json();
        if (response.ok) {
            // Handle successful registration
            window.location.href = 'index.html';
        } else {
            // Show error message
            document.getElementById('error-message').textContent = result.message || 'Registration failed';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        // Handle network or unexpected errors
        console.error('Registration error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
        document.getElementById('error-message').style.display = 'block';
    }
}

