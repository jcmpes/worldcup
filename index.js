var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

console.log('TEAMS', teams);

class Playoffs {
    constructor(name, teams) {
        this.schedule = [],
        this.matchDays = [],
        this.name = name,
        this.teams = teams
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    roundOf16(teamsToSchedule) {
        // Schedule matches
        for(let i = 0; i < 8; i = i+2) {
            this.matchDays.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))
        };
        console.log('MATCHES', this.matchDays);
        // Play the matches
        const results = [];
        for(const match in this.matchDays) {
            results.push(this.playMatch())
        };
        console.log('RESULTS', results)
    };

    playMatch() {
        let result = [0,0];
        while(result[0] == result[1]) {
            result = [
                Math.floor(Math.random() * 7),
                Math.floor(Math.random() * 7),              
            ]
        }
        return result;
    }

    standings() {
        const standings = [];

    }
    
}

const worldCupPlayOffs = new Playoffs;
worldCupPlayOffs.roundOf16(worldCupPlayOffs.shuffleTeams(teams))


