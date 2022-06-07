/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path")

/////////////////////////////////////////////
// Database Connection
/////////////////////////////////////////////
// Setup inputs for our connect function
const DATABASE_URL = process.env.DATABASE_URL;
const CONFIG = {
    useNewURLParser: true,
    useUnifiedTopology: true,
}

// const db = mongoose.connection //or could create this shortcut if called multiple times
// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG)

// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
//   const Schema = mongoose.Schema
//   const model = mongoose.model
//how you can create both at the same time instead of having to create the two seperate above ^
  const { Schema, model} = mongoose;

// make fruits schema
const fruitsSchema = new Schema ({
    name: String,
    color: String,
    readyToEat: Boolean,
});

// make fruit model
const Fruit = model("Fruit", fruitsSchema);