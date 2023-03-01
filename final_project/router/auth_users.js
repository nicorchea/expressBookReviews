const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ message: "Body Empty" });
  }
  let accessToken = jwt.sign(
    {
      data: user,
    },
    "access",
    { expiresIn: 60 * 60 }
  );
  req.session.authorization = {
    accessToken,
  };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!isbn || !review || !username) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const bookReviews = books[isbn].reviews;

  // Check if user already posted a review on this book
  if (bookReviews[username]) {
    // Update existing review
    bookReviews[username] = review;
  } else {
    // Add new review
    bookReviews[username] = review;
  }

  return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!isbn || !username) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const bookReviews = books[isbn].reviews;

  // Check if user has posted a review on this book
  if (!bookReviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete user's review
  delete bookReviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
