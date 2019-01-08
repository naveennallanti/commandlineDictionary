// function http(callback) {
//     console.log("fun1")
//     setTimeout(function () {
//         console.log("timeout fun2");
//         callback();
//     }, 500)
// }

// function def(callback) {
//     console.log("fun2")
//     callback()
// }

// function init() {
//     console.log("fun2")
//     def()
// }

// init();

// function foo(address, fn){
//        fn("location"); 

//   }
  
//   foo("address", function(location){
//     console.log(location) // this is where you get the return value
//   });


// definitionHandler(rand).then(function(){
//   console.log("then function")
// })
            // if (!searchWord) {
        //     console.log("Please enter a word to search")
        //     process.exit();
        // }
        // stdin.addListener("data", function (d) {

        //     console.log(d.toString().trim());
        //     if (d == -1) {
        //         process.exit();
        //     }
        //     else {
        //         searchWord = d;
        //         playHandler(searchWord);
        //     }
        // });



       //  var pick_def_rand="naveen"
       //  var str="";
       //  var jumbled;
       // for(var i=0;i<pick_def_rand.length;i++){
       //      jumbled = pick_def_rand[Math.floor(Math.random() * pick_def_rand.length)]
       //      str=str.concat(jumbled);
       //  }
       //  console.log(str);




// function options2(check){
//     check = check.toString().trim();
//     check = parseInt(check);
//
//         if(check==1) {
//             var str = "";
//             var selected_element;
//             for (var i = 0; i < rand.length; i++) {
//                 selected_element = rand[Math.floor(Math.random() * rand.length)]
//                 str = str.concat(selected_element);
//             }
//             console.log("Here is your jumbled word", str);
//             IO(play);
//         }
//         else if(check==2){
//             pick_def_rand = def_arr[Math.floor(Math.random() * def_arr.length)]
//             console.log("Here is Another Hint::\n", pick_def_rand);
//             IO(play);
//         }
//         else{
//             console.log("invalid selection");
//             process.exit();
//         }
// }
        