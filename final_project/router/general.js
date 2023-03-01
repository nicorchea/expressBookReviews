const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password were provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add user to users object
  users[username] = { password: password };

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get(booksEndpoint);
    const books = response.data;
    res.send(JSON.stringify(books));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:3000/books`);
    const filtered_books = Object.values(response.data).filter((book) => book.author === author);
    if (filtered_books.length === 0) {
      return res.status(404).json({ message: "No books found for author" });
    }
    res.send(filtered_books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:3000/books/title/${title}`);
    const filtered_books = response.data;
    if (filtered_books.length === 0) {
      return res.status(404).json({ message: "No books found for title" });
    }
    res.send(filtered_books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await axios.get(`http://localhost:3000/books/${isbn}`);
    if (!book) {
      return res.status(404).json({ message: "Book not found for ISBN" });
    }
    res.send(book.data.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;
