var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

console.log('TEAMS', teams);

class Playoffs {
    constructor(name, teams) {
        this.teamsToNextRound = [],
        this.resultsOfRound = [],
        this.matchDays = [],
        this.thirdPlace = [],
        this.name = name,
        this.teams = teams
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    newRound(teamsToSchedule) {
        // Schedule matches
        this.matchDays = [];
        for(let i = 0; i < teamsToSchedule.length; i = i+2) {
            this.matchDays.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))
        };
        console.log('MATCHES', this.matchDays);
        // Play the matches
        this.resultsOfRound = [];
        for(const match in this.matchDays) {
            this.resultsOfRound.push(this.playMatch())
        };
        console.log('RESULTS', this.resultsOfRound);
    };

    playMatch() {
        let result = [0,0];
        while(result[0] == result[1]) {
            result = [
                Math.floor(Math.random() * 7),
                Math.floor(Math.random() * 7)              
            ]
        };
        return result
    };

    winners() {
        // Show who passes to the next round
        this.teamsToNextRound = [];
        for(const match in this.matchDays) {
            if (this.resultsOfRound[match][0] > this.resultsOfRound[match][1]) {
                this.teamsToNextRound.push(this.matchDays[match][0])
            } else {
                this.teamsToNextRound.push(this.matchDays[match][1])
            };          
        }

        console.log('WINNERS', this.teamsToNextRound)
    }
};

const worldCupPlayOffs = new Playoffs;
worldCupPlayOffs.newRound(worldCupPlayOffs.shuffleTeams(teams));
console.log(worldCupPlayOffs.winners());
worldCupPlayOffs.newRound(worldCupPlayOffs.teamsToNextRound);
console.log(worldCupPlayOffs.winners());
worldCupPlayOffs.newRound(worldCupPlayOffs.teamsToNextRound)
console.log(worldCupPlayOffs.winners());
worldCupPlayOffs.newRound(worldCupPlayOffs.teamsToNextRound)
console.log(worldCupPlayOffs.winners());