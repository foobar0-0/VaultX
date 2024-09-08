const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Redirect to auth page if not logged in
if (!token) {
    window.location.href = 'auth.html';
}


// Function to delete account
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        fetch(`${API_URL}/user/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                localStorage.removeItem('token');
                window.location.href = 'auth.html';
            }
        })
        .catch(err => console.error('Delete Account Error:', err));
    }
}

// Function to reset password
function resetPassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    fetch(`${API_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
    })
    .catch(err => console.error('Reset Password Error:', err));
}

// Function to log out
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'auth.html';
}

//Function to display user info
async function fetchUserInfo() {
    try {
        //const token = localStorage.getItem('token'); // Ensure the token is correctly stored and retrieved
        if (!token) throw new Error('No token found');

        const response = await fetch(`${API_URL}/user-info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error fetching user info');
        const data = await response.json();

        document.getElementById('username').textContent = data.username;
        document.getElementById('email').textContent = data.email;
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}



// Call fetchUserInfo when the page loads
document.addEventListener('DOMContentLoaded', fetchUserInfo);