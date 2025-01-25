const express = require('express');
// Requiring axios module for making HTTP requests
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if username is valid
      if(!isValid(username)){
          return res.status(400).json({message: "User name should be more that 4 characters!"});
      }
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(201).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(400).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Simulate fetching book data from an external source (replace with actual API call)
    const listOfBooks = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(books);
      }, 500); // Simulate a 500ms delay
    });
  
    const received_books = await listOfBooks; 
  
    res.json(received_books); 
  } catch (error) {
    console.error('Error fetching book list:', error);
    res.status(500).json({ message: 'Error fetching book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Simulate fetching book data from an external source (replace with actual API call)
    const foundBook = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(books[isbn]);
      }, 500); // Simulate a 500ms delay
    });
  
    const book = await foundBook; 

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  
    res.json(book); 
  } catch (error) {
    console.error('Error fetching book by isbn:', error);
    res.status(500).json({ message: 'Error fetching book by isbn' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const foundBooks = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(
            Object.values(books).filter(book => book.author === author)
        );
      }, 500); // Simulate a 500ms delay
    });
  
    const booksByAuthor = await foundBooks; 

    if (!booksByAuthor) {
      return res.status(404).json({ message: 'Books not found' });
    }
  
    res.json(booksByAuthor); 
  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).json({ message: 'Error fetching books by author' });
  }  
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const foundBooks = new Promise((resolve, reject) => {
        setTimeout(() => {resolve(
            Object.values(books).filter(book => book.title === title)
        );
      }, 500); // Simulate a 500ms delay
    });
  
    const booksByTitle = await foundBooks; 

    if (!booksByTitle) {
      return res.status(404).json({ message: 'Books not found' });
    }
  
    res.json(booksByTitle); 
  } catch (error) {
    console.error('Error fetching books by title:', error);
    res.status(500).json({ message: 'Error fetching books by title' });
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;











