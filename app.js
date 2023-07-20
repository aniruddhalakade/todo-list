//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.use(express.static("public")); 

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://lakadeaniruddha:manali@cluster0.lgnsskk.mongodb.net/?retryWrites=true&w=majority/todolistDB", {useNewUrlParser: true});

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

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);



  app.get("/", async function (req, res) {
    const foundItems = await Item.find({});

    if (!(await Item.exists())) {
      await Item.insertMany(defaultItems);
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });

  app.get("/:customListName", (req,res) =>{
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
    .then(function(foundList){
      if(!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/"+ customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  });

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const listName = req.body.list.replace(" ","");
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } 
  else {
    List.findOne({ name: listName }).then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
      
        
    })
    .catch(function(err){
      console.log(err);
    });
  }
});

app.post("/delete", function(req, res){
 
  const checkedItemId = req.body.checkbox.trim();
  const listName = req.body.listName;
 
  if(listName === "Today") {
 
    Item.findByIdAndRemove(checkedItemId).then(function(foundItem){Item.deleteOne({_id: checkedItemId})})
 
    res.redirect("/");
 
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function (foundList)
      {
        res.redirect("/" + listName);
      });
  }
 
});

  




app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, ()=>{
  console.log("Server started on port 3000");
});