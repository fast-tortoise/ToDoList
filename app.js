//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/ToDoList');
}

const listSchema = new mongoose.Schema({
  listItem : String
})

const NormalItem = mongoose.model('Item', listSchema)
const WorkItem = mongoose.model('WorkItem', listSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = [];
const workItems = [];

async function getCommonList(){
  
  const normalList = await NormalItem.find({});
  normalList.forEach(element => {
    items.push(element.listItem)
  });
}
getCommonList();
async function getWorkList(){
  
  const workList = await WorkItem.find({});
  workList.forEach(element => {
    workItems.push(element.listItem)
  });
}
getWorkList();

app.get("/", function(req, res) {

  const day = date.getDate();
  
  res.render("list", {listTitle: day, newListItems: items});
});

app.post("/", function(req, res){

  const item = req.body.newItem;

  console.log(req.body);
  if (req.body.list === "Work") {

    const newWork = new WorkItem({listItem:item})
    newWork.save();
    workItems.push(item);
    res.redirect("/work");
  } 
  else {
    const newItem = new NormalItem({listItem: item});
    newItem.save();
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  
  res.render("list", {listTitle: "Work", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
