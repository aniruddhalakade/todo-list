//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
 name: "Welcome to your Todolist!!"
});

const item2 = new Item({
  name: "hit + button for a new item."
});

const item3 = new Item({
  name: "<-- Click this to delete an item"
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems)
  .then(function() {
    console.log(err);
  })
  .catch(function(err){
    console.log("successfully saved default items to DB");
  });

app.get("/", function(req, res) {

  res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, async()=>{
  await mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true}).then(console.log("Server started on port 3000"));
});