const { worker } = require("cluster");
var fs = require("fs");
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

// console.log('TEAMS', teams);

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

        // Play the matches
        this.resultsOfRound = [];
        this.matchDays.forEach(match => this.resultsOfRound.push(this.playMatch()))


        // Store the winners for the next round
        this.winners();

        // Show status
        for(const match in this.matchDays) {
            console.log(`${this.matchDays[match][0]} ${this.resultsOfRound[match][0]} - ${this.resultsOfRound[match][1]} ${this.matchDays[match][1]} => ${this.teamsToNextRound[match]}`)
        }
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
        // Store who passes to the next round
        this.teamsToNextRound = [];
        for(const match in this.matchDays) {
            if (this.resultsOfRound[match][0] > this.resultsOfRound[match][1]) {
                this.teamsToNextRound.push(this.matchDays[match][0])
            } else {
                this.teamsToNextRound.push(this.matchDays[match][1])
            };          
        }
        // console.log('WINNERS', this.teamsToNextRound)
    }
};

const worldCupPlayOffs = new Playoffs;
worldCupPlayOffs.teamsToNextRound = worldCupPlayOffs.shuffleTeams(teams);
console.log(`
==================================================
====== COMIENZO DE LA FASE DE ELIMINATORIAS ======
==================================================

===== OCTAVOS DE FINAL =====
`);
while (worldCupPlayOffs.teamsToNextRound.length > 1) {
    
    worldCupPlayOffs.newRound(worldCupPlayOffs.teamsToNextRound);
    switch(worldCupPlayOffs.teamsToNextRound.length) {
        case 8:
            console.log('\n===== CUARTOS DE FINAL =====\n')
            break;
        case 4:
            console.log('\n===== SEMIFINALES =====\n')
            break;
        case 2:
            console.log('\n===== FINAL =====\n')
            break;
        case 1:
            console.log(`
            ======================================
            🏆 ¡ ${worldCupPlayOffs.teamsToNextRound[0]} campeón del mundo ! 🎉
            ======================================
            `);
           
    }
    // console.log('NEW ROUND');
    
    
    // if (worldCupPlayOffs.teamsToNextRound.length = 1) {
        
    // } else
}