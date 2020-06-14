const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    Name: "Welcome to the to do list"
});
const item2 = new Item({
    Name: "Hit + to add new item"
});
const item3 = new Item({
    Name: "<-- to delete the item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

    Item.find(function (err, foundItems) {
        if (err) {
            console.log("err");
        } else {
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err) {
                        console.log("err");
                    } else {
                        console.log("Inserted new items");
                    }
                    res.redirect("/");
                });
            } else {
                res.render("list", {
                    listTitle: "Today",
                    items: foundItems
                });
            }


        }
    });
});


app.post("/", function (req, res) {
    const itemName = req.body.newItem;

    const item = new Item({
        Name: itemName
    });

    item.save();
    res.redirect("/");
});

app.post("/delete",function(req,res){
    const checkedItem = req.body.checkbox;
    console.log(checkedItem);
    Item.findByIdAndRemove(checkedItem, function(err){
        if(!err){
            console.log("no error. Successfully removd the item");
        }
    });
    res.redirect("/");
});


app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work Items",
        items: workItems
    });
});

app.post("/work", function (req, res) {
    res.redirect("/work");
})

app.listen(2500, function () {
    console.log("we are at server 2500");
});