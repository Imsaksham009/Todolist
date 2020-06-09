const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
var newItems = ["Wake Up Early", "Do Yoga", "Kill Corona Virus"];
var workItems = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    var options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };
    var today = new Date();
    var day = today.toLocaleDateString("hi-IN", options);
    res.render("list", {
        listTitle: day,
        items: newItems
    });
});


app.post("/", function (req, res) {
    var newItem = req.body.newItem;
    console.log(req.body.title)
    if (req.body.title === "Work") {
        workItems.push(newItem);
        res.redirect("/work");
    } else {
        newItems.push(newItem);
        res.redirect("/");
    }

   

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