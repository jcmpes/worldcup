var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

console.log(teams);

class Playoffs {
    constructor(name, teams) {
        this.name = name,
        this.teams = teams
    }

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams      
    }
}

const worldCupPlayOffs = new Playoffs;
console.log('SHUFFLE', worldCupPlayOffs.shuffleTeams(teams));

