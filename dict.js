var request = require("request");
var config = require("./config/config.json")
var baseUrl = config.baseUrl;
var logger = require('tracer').console({
    format: "{{timestamp}} [{{title}}] {{message}} (in {{path}}:{{line}})",
    dateformat: "dd-mm-yyyy HH:MM:ss TT"
});
var stdin = process.openStdin();

function definitionHandler(word) {
    //httpreq,
    //print design
}

function exampleHandler(word) {
    //httpreq,
    //print design
}


function synonymHandler(word) {
    //httpreq,
    //print design
}

function antonymHandler(word) {
    //httpreq,
    //print design
}

function fulldictHandler(word) {

}

function wordoftheDayHandler(word) {

}

function playHandler(word) {

}


function httpreqHandler(url, callback) {
    console.log("http request");
}


function init() {
    //validations and function calling

}
var commandType = process.argv[2];
var searchWord = process.argv[3];

init()
