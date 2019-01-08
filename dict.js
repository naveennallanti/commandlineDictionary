var request = require("request");
var config = require("./config/config.json");
var baseUrl = config.baseUrl;
var stdin = process.openStdin();

function definitionHandler(searchWord, play, callback) {

    var count = 0
    var url = baseUrl + searchWord;
    httpreqHandler(url, function (body) {
            var def_arr = [];
            if (!play) {
                console.log("\n\ndefinitions for ::", searchWord);
            }
            if (body.results) {
                body.results.forEach(function (item) {
                    item.lexicalEntries.forEach(function (item) {
                        item.entries.forEach(function (item) {
                            item.senses.forEach(function (item) {
                                if (item.definitions) {
                                    item.definitions.forEach(function (item) {
                                        if (!play) {
                                            console.log("\t\t", count = count + 1, ".", item);
                                        }
                                        else {
                                            def_arr.push(item)
                                        }

                                    })
                                }
                            })

                        })
                    })

                })
            }
            else {
                console.log("definitions not available");
            }
            if (play) {
                callback(def_arr);
            }
            else {
                callback();
            }

        }
    )
}

function exampleHandler(searchWord, callback) {
    var count = 0
    var url = baseUrl + searchWord;
    httpreqHandler(url, function (body) {
        console.log("\n\nExamples for ::", searchWord);
        if (body.results) {
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
        }
        else {
            console.log("Examples not availble")
        }
        callback();
    })
}


function synonymHandler(searchWord, callback) {
    var url = baseUrl + searchWord + '/synonyms'
    httpreqHandler(url, function (body) {
        // console.log(body);
        var count = 0;
        console.log("Synonyms for ::", searchWord)
        if (body.results) {
            body.results.forEach(function (item) {
                item.lexicalEntries.forEach(function (item) {
                    item.entries.forEach(function (item) {
                        item.senses.forEach(function (item) {
                            if (item.synonyms) {
                                item.synonyms.forEach(function (item) {
                                    console.log("\t\t", count = count + 1, "..", item.text);
                                })
                            }
                        })
                    })
                })

            })
        }
        else {
            console.log("Synonyms not availble")
        }
        callback();
    })
}

function antonymHandler(searchWord, callback) {
    var url = baseUrl + searchWord + '/antonyms'
    httpreqHandler(url, function (body) {
        // console.log(body);
        var count = 0;
        console.log("Antonyms for ::", searchWord);
        if (body.results) {
            body.results.forEach(function (item) {
                item.lexicalEntries.forEach(function (item) {
                    item.entries.forEach(function (item) {
                        item.senses.forEach(function (item) {
                            if (item.antonyms) {
                                item.antonyms.forEach(function (item) {
                                    console.log("\t\t", count = count + 1, "..", item.text);
                                })
                            }
                        })
                    })
                })

            })
        }
        else {
            console.log("antonyms not availble")
        }
        callback();
    })
}

function alldetailsHandler(searchWord, callback) {
    definitionHandler(searchWord, null, function () {
        exampleHandler(searchWord, function () {
            synonymHandler(searchWord, function () {
                antonymHandler(searchWord, function () {
                    callback()
                });
            });
        });
    });
}

function wordoftheDayHandler() {
    var rand = config.odd_words[Math.floor(Math.random() * config.odd_words.length)];
    alldetailsHandler(rand, function () {
        process.exit();
    });
}

function playHandler() {
    var rand = config.odd_words[Math.floor(Math.random() * config.odd_words.length)];
    var pick_def_rand;
    // console.log("rand word is",rand);
    rand = rand.toString();

    definitionHandler(rand, true, function (def_arr) {
        pick_def_rand = def_arr[Math.floor(Math.random() * def_arr.length)]
        console.log("Guess the word for definition::\n\t", pick_def_rand);
        console.log("Please enter the word::\n")

        stdin.addListener("data", function (guessed_word) {
            guessed_word = guessed_word.toString().trim();
            if (guessed_word == rand) {
                console.log("***Contratulations Correct answer***");
                process.exit();
            } else {
                // console.log("wrong answer")
                console.log('Wrong Answer!!');
                console.log("1.for Try again\n2.for Hint\n3.for Quit")
                console.log("please select any of the above::");
            }
            if (guessed_word == 1) {
                console.log("Please enter the word::\n")
            }
            else if (guessed_word == 2) {
                var str = "";
                var selected_element;
                for (var i = 0; i < rand.length; i++) {
                    selected_element = rand[Math.floor(Math.random() * rand.length)]
                    str = str.concat(selected_element);
                }
                console.log("Here is your jumbled word", str);
                console.log("Please enter the word::\n")
            }
            else if (guessed_word == 3) {
                console.log("The word is::", rand, "\nHere are the All details of the word", rand);
                alldetailsHandler(rand, function () {
                    console.log("*******Game Ended*********")
                    process.exit();
                });
            }
        })
    })
}

function httpreqHandler(url, callback) {
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
            return console.log("error:", error);
        }
        //  console.log("body in http", body);
        callback(body);
    });
}

function init(commandType, searchWord) {
    if (!commandType && !searchWord) {
        console.log("word of the day");
        wordoftheDayHandler(null, function () {
            console.log("***********done***********");
            process.exit()
        });
    } else if (commandType == 'def') {
        console.log("definition")
        if (!searchWord) {
            console.log("Please enter a word to search")
            process.exit();
        }
        definitionHandler(searchWord, null, function () {
            console.log("***********done***********");
            process.exit()
        })
    } else if (commandType == 'syn') {
        console.log("synonyms")
        if (!searchWord) {
            console.log("Please enter a word to search");
            process.exit();
        }
        synonymHandler(searchWord, function () {
            console.log("***********done***********");
            process.exit()

        })
    } else if (commandType == 'ant') {
        console.log("antonyms");
        if (!searchWord) {
            console.log("Please enter a word to search")
        }
        antonymHandler(searchWord, function () {
            console.log("************done**********");
            process.exit()
        });
    } else if (commandType == 'ex') {
        console.log("examples")
        if (!searchWord) {
            console.log("Please enter a word to search")
            process.exit();
        }
        //  console.log("example");
        exampleHandler(searchWord, function () {
            console.log("***********done***********");
            process.exit()
        });
    } else if (commandType == "play") {
        playHandler()
    } else if (commandType == "dict" || (commandType && !searchWord)) {
        console.log("all details");
        if (commandType == "dict" && !searchWord) {
            console.log("please enter a word as second argument");
            process.exit();
        } else if (searchWord) {
            alldetailsHandler(searchWord, function () {
                console.log("***********done***********");
                process.exit();
            });
        } else {
            alldetailsHandler(commandType, function () {
                console.log("***********done***********");
                process.exit();
            });
        }

    } else {
        console.log("invalid input");
    }
}

if (process.argv.length > 4) {
    return console.log("invalid number of parameters");
}
init(process.argv[2], process.argv[3]);