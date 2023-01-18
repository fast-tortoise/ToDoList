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

const List = new mongoose.Schema({
  listName : String,
  listItems : [listSchema]
})

const ListModel = mongoose.model('List', List)
const NormalItem = mongoose.model('Item', listSchema)

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var completedTask = "";

app.get('/:newTodo', (req, res) => {
  const newTodo = req.params.newTodo;
  var newList;
  async function createNewList(){
  await ListModel.findOne({listName: newTodo}, function (err, docs) {
      if (!err){
        if (!docs){
          console.log(err)
          newList = new ListModel({
            listName : newTodo,
            listItems : []
          });
          newList.save();
          res.redirect('/'+ newTodo);
        }
        else{
          newList = docs;
          var listToSend = newList.listItems;
          res.render("list", {listTitle: req.params.newTodo, newListItems: listToSend});
        }
      }
      else{
        console.log(err)
      }
    }).clone();
  }
  createNewList();
  
})

app.get("/", function(req, res) {
  async function getCommonList(){
    var normalList = await NormalItem.find({});
    res.render("list", {listTitle: 'ToDoList', newListItems: normalList});
  }
  getCommonList();
  
});

async function postHanderler(item, list){
  console.log("I'm    *****************************************  here") 
  const newItem = new NormalItem({ listItem: item });
  ListModel.findOne({listName: list}, function (err, listDoc){
    if(!err){
      listDoc.listItems.push(newItem);
      listDoc.save();
    }
    else{
      console.log(err)
    }
  });
}

app.post("/", function(req, res){
  const item = req.body.newItem;
  const list = req.body.list;
  console.log(req.body);
  if(list == 'ToDoList'){
    const newItem = new NormalItem({listItem: item});
    newItem.save();
    res.redirect("/");
  }
    else{
      postHanderler(item, list);
      res.redirect("/"+list);
    }
});

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/delete", function(req, res){
  completedTask = req.body.checkbox
  console.log(typeof completedTask)
    async function deleteOneMain(){
      var del= await NormalItem.deleteOne({ listItem: completedTask })
      console.log(del)
    }
    deleteOneMain()
    res.redirect("/")
  // }
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
})