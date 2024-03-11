// Function to handle form submission
document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get user input values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Your backend endpoint for signup
    const signupUrl = 'http://localhost:3000/signup';

    // Data to be sent to the backend
    const data = {
        username: username,
        email: email,
        password: password
    };

    // Send POST request to the backend using Axios
    axios.post(signupUrl, data)
        .then(function(response) {
            console.log('Signup successful:', response.data);
            window.location.href = 'index.html';
            // You can redirect the user to a new page or perform other actions upon successful signup
        })
        .catch(function(error) {
            console.error('Error signing up:', error);
            if (error.response.status === 409) {
                alert('Email already exists');
            } else {
                // Handle other errors or display error messages to the user
            }
        });
});
