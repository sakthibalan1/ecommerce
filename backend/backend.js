const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Generate a random session secret key
const sessionSecret = generateRandomString(32);

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Enter your MySQL password here
  database: 'ecommercedb' // Make sure this matches your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Set up session middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));

// API endpoint for user signup
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email already exists in the database
  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err);
      res.status(500).send('Error checking email');
    } else {
      if (result.length > 0) {
        // If email already exists, send a 409 status code to the frontend
        res.status(409).send('Email already exists');
      } else {
        // Insert user into the database if email doesn't exist
        const insertUserQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(insertUserQuery, [username, email, password], (err, result) => {
          if (err) {
            console.error('Error signing up:', err);
            res.status(500).send('Error signing up');
          } else {
            console.log('User signed up successfully');
            res.status(200).send('User signed up successfully');
          }
        });
      }
    }
  });
});

// API endpoint for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password match in the database
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).send('Internal server error');
    } else {
      if (result.length > 0) {
        // User found, set loggedIn and username in session
        req.session.loggedIn = true;
        req.session.username = result[0].username;
        res.status(200).json({ loggedIn: true, username: result[0].username });
      } else {
        // User not found or invalid credentials
        res.status(401).send('Invalid email or password');
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Generate a random string of specified length
function generateRandomString(length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') // Convert to hexadecimal format
    .slice(0, length); // Trim to desired length
}
