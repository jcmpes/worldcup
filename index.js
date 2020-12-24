var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

console.log(teams);

class Playoffs {
    constructor(name, teams) {
        this.schedule = []
        this.name = name,
        this.teams = teams
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams      
    };

    roundOf16(teamsToSchedule) {
        const matchDays = [];
        for(let i = 0; i < 8; i = i+2) {
            matchDays.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))

        }
        console.log(matchDays)
    };



    
}

const worldCupPlayOffs = new Playoffs;
console.log('ROUND OF 16', worldCupPlayOffs.roundOf16(worldCupPlayOffs.shuffleTeams(teams)));

