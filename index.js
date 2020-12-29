var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

console.log('TEAMS', teams);

class Playoffs {
    constructor(name, teams) {
        this.winners16 = [],
        this.results16 = [],
        this.matchDays16 = [],
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
            this.matchDays16.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))
        };
        console.log('MATCHES', this.matchDays16);
        // Play the matches
        for(const match in this.matchDays16) {
            this.results16.push(this.playMatch())
        };
        console.log('RESULTS', this.results16);
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
        for(const match in this.matchDays16) {
            if (this.results16[match][0] > this.results16[match][1]) {
                this.winners16.push(this.matchDays16[match][0])
            } else {
                    this.winners16.push(this.matchDays16[match][1])
            };          
        }
        
        // for(let i = 0; i < this.matchDays16.length; i++ ) {
        //     if(this.results16[i][0] > this.results16[0][1]) {
        //         console.log(`Gana ${this.matchDays16[i][0]}`)
        //         // this.winners16.push(this.matchDays16[i][0])
        //     } else {
        //         console.log(`Gana ${this.matchDays16[i][1]}`)
        //         // this.winners16.push(this.matchDays16[i][1])
        //     }
        // }
        console.log('WINNERS', this.winners16)
    };
    
}

const worldCupPlayOffs = new Playoffs;
worldCupPlayOffs.roundOf16(worldCupPlayOffs.shuffleTeams(teams))
console.log(worldCupPlayOffs.winners())