const fs = require("fs");

// console.log("before reading");

/* Read in sync way*/
// const content = fs.readFileSync("input.txt");
// console.log("output: " + content);

/* reading in async way */

// fs.readFile("input.txt", (err, output) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("output: " + output);
//   }
// });

// console.log("after reading");

console.log("before reading");

/*write in sync way*/

// fs.writeFileSync("output.txt", "Hello everybody");

/*write in Async way*/

fs.writeFile("output2.txt", "hello foaks", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("successfull Written");
  }
});

console.log("after reading");
