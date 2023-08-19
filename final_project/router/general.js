const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    const blank = !username ? username : password;

    if (username && password) {
        const checkUsername = users.filter(user => user.username === username);

        if (checkUsername.length > 0) {
            return res.status(404).json({ message: 'User already exists.'});
        } else {
            users.push({ username, password });
            return res.status(200).json({ message: `User registered with the username: ${username}`});
        }
    }

    return res.status(404).json({ message: `User unable to register. should submit ${blank} to be registered.` });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({ message: 'The list of all books is here.', data: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    for (const key in books) {
        if (key === isbn) {
            return res.status(200).json({ message: `the book with the isbn ${isbn} is retrieved.`, data: books[key] });
        }
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    for (const key in books) {
        if (books[key].author.includes(author)) {
            return res.status(200).json({ message: `the book with the author ${author} is retrieved.`, data: books[key] });
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    for (const key in books) {
        if (books[key].title.includes(title)) {
            return res.status(200).json({ message: `the book with the title ${title} is retrieved.`, data: books[key] });            
        }
    }    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    for (const key in books) {
        if (key === isbn) {
            return res.status(200).json({ message: `the review with the isbn ${isbn} is retrieved.`, data: books[key].reviews });
        }
    }  
});

module.exports.general = public_users;
