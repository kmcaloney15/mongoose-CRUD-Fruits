/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const path = require("path");
// const mongoose = require("./models/connections.js"); //same value as if left here but now passing through new file //no longer need to require it here since it was moved to fruit.js and not called in server.js anymore
// const Fruit = require("./models/fruit.js") //no longer needed
const FruitRouter = require("./controllers/fruits.js")
const UserRouter = require("./controllers/users.js")
const session = require("express-session")
const MongoStore = require("connect-mongo"); //what connects to the mongo database


/////////////////////////////////////////////////
// Create our Express Application Object Bind Liquid Templating Engine
/////////////////////////////////////////////////
//didn't include app at the top since it's only used here
const app = require("liquid-express-views")(express(), {
  root: [path.resolve(__dirname, "views/")],
});

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use(express.static("public")); // serve files from public statically
// middleware to setup session
app.use(
  session({
    secret: process.env.SECRET, //SECRET=IKnowSomeThingYouDontKnow
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    saveUninitialized: true,
    resave: false,
  })
);


////////////////////////////////////////////
// Routes (Root Route)
////////////////////////////////////////////
app.use("/fruits", FruitRouter); //now has access to all routes in fruits.js and will put the /fruit in front of every route created within that router

app.use("/users", UserRouter); // send all "/user" routes to user router


// app.get("/", (req, res) => { //leave this one in server!!!
//   res.send(`your server is running... you better catch it.`);
// });
app.get("/", (req, res) => {
  res.render("index.liquid");
});




//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT; // variable port that I'm pulling from the .env - this way you don't have to call it everytime you want to use it
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
