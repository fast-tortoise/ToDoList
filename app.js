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

var completedTask = "";

async function getWorkList(){
  const workList = await WorkItem.find({});
}
getWorkList();

// app.get('/:newTodo', (req, res) => {
//   variable = mongoose.model(variable, listSchema);
//   res.render("list", {listTitle: req.params.newTodo, newListItems: normalList});
// })

app.get("/", function(req, res) {
  async function getCommonList(){
    var normalList = await NormalItem.find({});
    res.render("list", {listTitle: 'ToDoList', newListItems: normalList});
  }
  getCommonList();
  
});

app.post("/", function(req, res){
  const item = req.body.newItem;
  console.log(req.body);
  // if (req.body.list === "Work") {
  //   const newWork = new WorkItem({listItem:item})
  //   newWork.save();
  //   res.redirect("/work");
  // } 
  // else {
    const newItem = new NormalItem({listItem: item});
    newItem.save();
    res.redirect("/");
  // }
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/delete", function(req, res){
  completedTask = req.body.checkbox
  console.log(typeof completedTask)
  // if (workItems.includes(completedTask)){
  //   const newWorkList = workItems.filter(function(item){
  //     return item !== completedTask
  //   })
  //   workItems = newWorkList;
  //   deleteOne();
  //   res.redirect("/work" )
  // }
  
  // else{
    async function deleteOneMain(){
      var del= await NormalItem.deleteOne({ listItem: completedTask })
      console.log(del)
    }
    deleteOneMain()
    res.redirect("/")
  // }
})

async function deleteOne(){
  var del= await WorkItem.deleteOne({ listItem: completedTask })
  console.log(del)
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
})