////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Fruit = require("../models/fruit.js");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();
//change all instances of router. get etc, to router

////////////////////////////////////////
// Router Middleware
////////////////////////////////////////
// Authorization Middleware
router.use((req, res, next) => {
  //now you can't access "/fruits" w/o logging in first
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/users/login");
  }
});

/////////////////////////////////////////
// Routes - all fruit routes specifically
/////////////////////////////////////////

//SEED NEEDS TO BE NEAR THE TOP
//any time you go to this link, it will delete all data and then add in only the data listed below
//used to test that database is working without having to create new create page, add in data and then test
router.get("/seed", (req, res) => {
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

// index route / will only show the loggin in user fruits
router.get("/", (req, res) => {
  // find all the fruits
  Fruit.find({ username: req.session.username })
    // render a template after they are found
    .then((fruits) => {
      console.log(fruits);
      res.render("fruits/index.liquid", { fruits });
    })
    // send error as json if they aren't
    .catch((error) => {
      console.log(error);
      res.json({ error });
    });
});

// don't need this any more but keeping as an example of the async / await method
// router.get("/", async (req, res) => {
//   //async looks for any kind of awaits - async knows it has to wait for await to finsh running before it will run it's function
//   const fruits = await Fruit.find({}); // Fruits.find({}) takes a long time to run
//   // await has it wait a second allowing Fruits.find({}) to run before it runs allowing the data to be retrived from the database
//   res.render("fruits/index.liquid", { fruits });
// });

//NEW ROUTE
router.get("/new", (req, res) => {
  res.render("fruits/new");
});

// CREATE route
router.post("/", (req, res) => {
  // check if the readyToEat property should be true or false
  req.body.readyToEat = req.body.readyToEat === "on" ? true : false;
  // add username to req.body to track related user
  req.body.username = req.session.username;
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
router.get("/:id/edit", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router; //router contains all info in here
