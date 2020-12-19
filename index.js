var fs = require("fs");
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

console.log(teams);