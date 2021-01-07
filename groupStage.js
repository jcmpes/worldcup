var fs = require("fs");
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

class League {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams;
    }

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    printTeams(teams) {
        console.log(this.name, this.shuffleTeams(teams))
    }
}

const groupStage = new League('groups', teams)
groupStage.printTeams(teams)