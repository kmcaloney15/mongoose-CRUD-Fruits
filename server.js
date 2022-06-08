/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express"); // import express
const morgan = require("morgan"); //import morgan
const methodOverride = require("method-override");
const path = require("path");
// const mongoose = require("./models/connections.js"); //same value as if left here but now passing through new file //no longer need to require it here since it was moved to fruit.js and not called in server.js anymore
const Fruit = require("./models/fruit.js")


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

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send(`your server is running... you better catch it.`);
});

//SEED NEEDS TO BE NEAR THE TOP
//any time you go to this link, it will delete all data and then add in only the data listed below
//used to test that database is working without having to create new create page, add in data and then test
app.get("/fruits/seed", (req, res) => {
  // array of starter fruits
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ];

  // Delete all fruits
  Fruit.deleteMany({}).then((data) => {
    // Seed Starter Fruits
    Fruit.create(startFruits).then((data) => {
      // send created fruits as response to confirm creation
      res.json(data); //returning json data on route page
    });
  });
});

// Index Route / The Async/Await Method
app.get("/fruits", async (req, res) => {
  //async looks for any kind of awaits - async knows it has to wait for await to finsh running before it will run it's function
  const fruits = await Fruit.find({}); // Fruits.find({}) takes a long time to run
  // await has it wait a second allowing Fruits.find({}) to run before it runs allowing the data to be retrived from the database
  res.render("fruits/index.liquid", { fruits });
});



//NEW ROUTE
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new");
});



// CREATE route
app.post("/fruits", (req, res) => {
  // check if the readyToEat property should be true or false
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  // create the new fruit
  Fruit.create(req.body)
    .then((fruits) => {
      // redirect user to index page if successfully created item
      res.redirect("/fruits");
    })
    // send error as json
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});


// EDIT ROUTE
app.get("/fruits/:id/edit", (req, res) => {
  // get the id from params
  const id = req.params.id;
  // get the fruit from the database
  Fruit.findById(id)
    .then((fruit) => {
      // render edit page and send fruit data
      res.render("fruits/edit.liquid", { fruit });
    })
    // send error as json
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});

// PUT ROUTE
//update route
app.put("/fruits/:id", (req, res) => {
  // get the id from params
  const id = req.params.id;
  // check if the readyToEat property should be true or false
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  // update the fruit
  Fruit.findByIdAndUpdate(id, req.body, { new: true })
    .then((fruit) => {
      // redirect to main page after updating
      res.redirect("/fruits");
    })
    // send error as json
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});


//DELETE ROUTE
app.delete("/fruits/:id", (req, res) => {
  // get the id from params
  const id = req.params.id;
  // delete the fruit
  Fruit.findByIdAndRemove(id)
    .then((fruit) => {
      // redirect to main page after deleting
      res.redirect("/fruits");
    })
    // send error as json
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});







//SHOW ROUTE SHOULD ALWAYS BE NEAR TO BOTTOM TO AVOID MESS UP WITH EARLIER PAGES
// show route
app.get("/fruits/:id", (req, res) => {
  // get the id from params
  const id = req.params.id;

  // find the particular fruit from the database
  Fruit.findById(id)
    .then((fruit) => {
      // render the template with the data from the database
      res.render("fruits/show.liquid", { fruit });
    })
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT; // variable port that I'm pulling from the .env - this way you don't have to call it everytime you want to use it
app.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}`);
});
