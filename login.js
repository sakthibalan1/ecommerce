document.addEventListener('DOMContentLoaded', function() {
    // Add event listener after DOM is fully loaded
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Get user input values
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Your backend endpoint for login
        const loginUrl = 'http://localhost:3000/login'; // Replace with your actual backend endpoint URL

        // Data to be sent to the backend
        const data = {
            email: email,
            password: password
        };

        // Send POST request to the backend using Axios
        axios.post(loginUrl, data)
        .then(function(response) {
            console.log('Login successful:', response.data);
            window.location.href = 'home.html';
        })
        .catch(function(error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error logging in:', error.response.data);
                // Here you can display an error message to the user indicating wrong email or password
                alert('Invalid email or password. Please try again.');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from the server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error processing the request:', error.message);
            }
        });
    
    });

});
