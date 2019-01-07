var request = require("request");
var config = require("./config/config.json");
var baseUrl = config.baseUrl;
var Promise = require("promise");
var logger = require('tracer').console({
    format: "{{timestamp}} [{{title}}] {{message}} (in {{path}}:{{line}})",
    dateformat: "dd-mm-yyyy HH:MM:ss TT"
});
var async_await = require("async-await")
var def_arr = [];
var stdin = process.openStdin();


function definitionHandler(searchWord, play, callback) {
    if (!play) {
        logger.log("\n\ndefinitions for ::", searchWord);
    }
    var count = 0
    var url = baseUrl + searchWord;
    httpreqHandler(url, function (body) {
        var def_arr = [];
        body.results.forEach(function (item) {
            item.lexicalEntries.forEach(function (item) {
                item.entries.forEach(function (item) {
                    item.senses.forEach(function (item) {
                        if (item.definitions) {
                            item.definitions.forEach(function (item) {
                                if(!play){
                                    console.log("\t\t", count = count + 1, ".", item);
                                }
                                else{
                                    def_arr.push(item)
                                }
                                
                            })
                        }
                    })

                })
            })

        })
        if (play) {
            callback(def_arr);
        }

    })
}

function exampleHandler(searchWord) {

    logger.log("\n\nExamples for ::", searchWord);
    var count = 0
    var url = baseUrl + searchWord;
    httpreqHandler(url, function (body) {
        body.results.forEach(function (item) {
            item.lexicalEntries.forEach(function (item) {
                item.entries.forEach(function (item) {
                    item.senses.forEach(function (item) {
                        if (item.examples) {
                            item.examples.forEach(function (item) {
                                console.log("\t\t", count = count + 1, "..", item.text);
                            })
                        }
                    })
                })
            })

        })
    })
}


function synonymHandler(searchWord) {
    console.log("no synonyms available");
}

function antonymHandler(searchWord) {
    console.log("no antonyms available");
}

function alldetailsHandler(searchWord) {
    definitionHandler(searchWord);
    exampleHandler(searchWord);
    synonymHandler(searchWord);
    antonymHandler(searchWord);
}

function wordoftheDayHandler() {
    var rand = config.odd_words[Math.floor(Math.random() * config.odd_words.length)];
    alldetailsHandler(rand);
}

function playHandler() {
    var rand = config.odd_words[Math.floor(Math.random() * config.odd_words.length)];
    var pick_def_rand;
    definitionHandler(rand, true, function (def_arr) {
        pick_def_rand = def_arr[Math.floor(Math.random() * def_arr.length)]
        console.log("Guess the word for::\n", pick_def_rand);
        console.log("Enter the word::\n")

        function playAgain() {
            stdin.addListener("data", function (guessed_word) {
                console.log(d.toString().trim());
                process.stdin.destroy();
                if (guessed_word == rand) {
                    console.log("Correct answer");
                } else {
                    console.log("1.for Try again\n2.for Hint\n3.for Quit")
                    console.log("Enter choice");
                    stdin.addListener("data", function (choose) {
                        switch (choose) {
                            case 1:
                                {
                                    playAgain();
                                    break;
                                }
                            case 2:
                                {
                                    console.log("1.jumbled word\n2.foranother definition")
                                    stdin.addListener("data", function (choose) {
                                        switch (choose) {
                                            case 1:
                                                {
                                                    console.log("Here is your jumbled word");
                                                    var str = "";
                                                    var selected_element;
                                                    for (var i = 0; i < rand.length; i++) {
                                                        selected_element = rand[Math.floor(Math.random() * rand.length)]
                                                        str = str.concat(selected_element);
                                                    }
                                                    console.log(str);
                                                    break;
                                                }
                                            case 2:
                                                {
                                                    pick_def_rand = def_arr[Math.floor(Math.random() * def_arr.length)]
                                                    console.log("Here is Another Hint::\n", pick_def_rand);
                                                    playAgain();
                                                }
                                            default:
                                                {
                                                    console.log("invalid input");
                                                    process.exit();
                                                }
                                        }
                                    })
                                    break;
                                }
                            case 3:
                                {
                                    alldetailsHandler(rand)
                                    break
                                }
                            default:
                                {
                                    console.log("inValid selection")
                                    process.exit();
                                }
                        }
                    })
                }
            });
        }

    })
}


function httpreqHandler(url, callback) {
    console.log("http request");
    request({
        method: 'GET',
        url: url,
        headers: {
            "content-type": "application/json",
            "app_id": config.app_id,
            "app_key": config.api_key
        },
        json: true,
    }, function (error, response, body) {
        if (error) {
            return logger.log("error:", error);
        }
        //  logger.log("body in http", body);
        callback(body);
    });
}


function init(commandType, searchWord) {
    logger.log("commandType", commandType);
    logger.log("searchWord", searchWord);
    if (!commandType && !searchWord) {
        logger.log("word of the day");
        wordoftheDayHandler();
    } else if (commandType == 'def') {
        console.log("definition")
        if (!searchWord) {
            console.log("Please enter a word to search")
            process.exit();
        }
        definitionHandler(searchWord)
    } else if (commandType == 'syn') {
        logger.log("synonyms")
        if (!searchWord) {
            console.log("Please enter a word to search")
            process.exit();
        }
        synonymHandler(searchWord)
    } else if (commandType == 'ant') {
        logger.log("antonyms");
        if (!searchWord) {
            console.log("Please enter a word to search")
        }
        antonymHandler(searchWord);
    } else if (commandType == 'ex') {
        if (!searchWord) {
            console.log("Please enter a word to search")
            process.exit();
        }
        //  logger.log("example");
        exampleHandler(searchWord);
    } else if (commandType == "play") {
        playHandler()
    } else if (commandType == "dict" || (commandType && !searchWord)) {
        logger.log("all details");

        if (commandType == "dict" && !searchWord) {
            console.log("please enter a word")
        } else if (searchWord) {
            alldetailsHandler(searchWord);
        } else {
            alldetailsHandler(commandType);
        }

    } else {
        logger.log("invalid input");
    }
}

function exit() {
    process.exit();
}


if (process.argv.length > 4) {
    return console.log("invalid number of parameters");
}
if (typeof process.argv[2] != "string" || (process.argv[3] && typeof process.argv[3] != "string")) {
    console.log("hai")
    return console.log("invalid arguments type enter arguments as strings")
}
console.log("dude");
init(process.argv[2], process.argv[3]);