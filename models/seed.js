//*** used for development fase to test all pages with some data - won't need once launched */


///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require("./connections.js");
const Fruit = require("./fruit.js");

///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////

// save the connection in a variable
const db = mongoose.connection;

// Make sure code is not run till connected
db.on("open", () => {
  ///////////////////////////////////////////////
  // Write your Seed Code Below
  //////////////////////////////////////////////

  // Run any database queries in this function
  const startFruits = [
    { name: "Orange", color: "orange", readyToEat: false },
    { name: "Grape", color: "purple", readyToEat: false },
    { name: "Banana", color: "orange", readyToEat: false },
    { name: "Strawberry", color: "red", readyToEat: false },
    { name: "Coconut", color: "brown", readyToEat: false },
  ];

  // Delete all fruits
  Fruit.deleteMany({})
    .then((deletedFruits) => {
      // add the starter fruits
      Fruit.create(startFruits)
        .then((newFruits) => {
          // log the new fruits to confirm their creation
          console.log(newFruits);
          db.close();
        })
        .catch((error) => {
          console.log(error);
          db.close();
        });
    })
    .catch((error) => {
      console.log(error);
      db.close();
    });

  ///////////////////////////////////////////////
  // Write your Seed Code Above
  //////////////////////////////////////////////
});
