const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const usersWithTheName = users.filter(user => user.username === username);
    return usersWithTheName.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const validUsers = users.filter(user => user.username === username && user.password === password);
    return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.query;

    if (!username || !password) return res.status(404).json({ message: 'Error on logging in' });

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: 'User successfully logged in.' });
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const { review } = req.query;
    const { isbn } = req.params;
    const { username } = req.session.authorization;
    let title;

    const arrayed = [];
    for (const key in books) {
        arrayed.push({ ...books[key], isbn: key });
    }

    const theBook = arrayed.filter((book, idx) => book.idx + 1 + '' === isbn );
    const arrayedReviews = [];
    for (const key in theBook.reviews) {
        arrayedReviews.push({ user: username, review: theBook.reviews[key] });
    }

    if (theBook.length > 0) {
        arrayedReviews.forEach(item => {
            if (item.user === username) {
                books[item.isbn].reviews.user = review; 
                return res.status(200).json({ message: `Review updated for isbn: ${isbn}, title: ${title} which says ${review}` });
            } else {
                theBook.reviews.username = review;
                return res.status(200).json({ message: `Review added for isbn: ${isbn}, title: ${title} which says ${review}` });
            }
        });
    } else {
        theBook.reviews.username = review;
        return res.status(200).json({ message: `Review added for isbn: ${isbn}, title: ${title} which says ${review}` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
