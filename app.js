const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
const { lastIndexOf } = require("lodash");

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
    }
});


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


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
    const title = req.body.title;
    const item = new Item({
        Name: itemName
    });

    if (title === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: title
        }, function (err, foundList) {
            if (!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + title);

            }
        });

    }
});



app.post("/delete", function (req, res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        console.log(checkedItem);
        Item.findByIdAndRemove(checkedItem, function (err) {
            if (!err) {
                console.log("no error. Successfully removd the item");
            }
        });
        res.redirect("/");
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItem}}},function(err,foundList){
            res.redirect("/"+listName);
            console.log(checkedItem);
        });
    }

});

app.get("/:title", function (req, res) {
    var requestedTitle = req.params.title;
    var listTitleName = _.upperFirst(requestedTitle);
    console.log(listTitleName);
    List.findOne({
        name: listTitleName
    }, function (err, foundList) {
        if (err) {
            console.log("Err");
        } else {
            if (foundList) {
                res.render("list", {
                    listTitle: listTitleName,
                    items: foundList.items
                });
            } else {
                const list = new List({
                    name: listTitleName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + listTitleName);
            }
        }
    });
});


app.post("/work", function (req, res) {
    res.redirect("/work");
})

app.listen(2500, function () {
    console.log("we are at server 2500");
});