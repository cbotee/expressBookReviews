require('dotenv').config();
const bodyParser = require('body-parser'); // Enable parsing of request body data
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secret = process.env.SECRET_KEY;

regd_users.use(bodyParser.json()); // Parse JSON request bodies

const isValid = (username)=>{ //returns boolean
    return username.length >= 5;
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter users array for a user with matching username and password
    const validUser = users.find((user) => user.username === username && user.password === password);
    return validUser !== undefined; // Return true if valid user found, otherwise false
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(400).json({ message: "Username or password is missing" });
  }

  // Validate username
  if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username format" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token with appropriate payload (e.g., user ID)
      const accessToken = jwt.sign({ username: username }, secret, { expiresIn: 60 * 60 });

      // Consider using a secure mechanism (e.g., HttpOnly cookies) to store access token
      // This example stores it in the response for demonstration purposes
      return res.status(201).json({ message: "User successfully logged in", accessToken });
  } else {
      return res.status(401).json({ message: "Invalid login credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user; 
  const review = req.body.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    // Update existing review
    books[isbn].reviews[username] = review;
  } else {
    // Add new review
    books[isbn].reviews[username] = review;
  }

  res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review by isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.user; 

    if (books[isbn]) {
        // Delete review from 'books' object based on provided isbn
        delete books[isbn];
    }
    
    // Send response confirming deletion of review
    res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
