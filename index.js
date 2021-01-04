// Define normal playoffs mode and third place mode
const NORMAL_MODE = 0;
const THIRD_PLACE_MODE = 1;

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
        this.teamsEliminated = [],
        this.teamsToThirdPlace = [],
        this.name = name,
        this.teams = teams
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    newRound(teamsToSchedule, mode) {
        // Schedule matches
        this.matchDays = [];
        for(let i = 0; i < teamsToSchedule.length; i = i+2) {
            this.matchDays.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))
        };

        // Play the matches
        this.resultsOfRound = [];
        this.matchDays.forEach(match => this.resultsOfRound.push(this.playMatch()))


        // Store the winners for the next round
        if (mode == NORMAL_MODE) {
            this.winners(NORMAL_MODE);
        } else {
            this.winners(THIRD_PLACE_MODE)
        }

        // Show status
        for(const match in this.matchDays) {
            if (mode == NORMAL_MODE) {
                console.log(`${this.matchDays[match][0]} ${this.resultsOfRound[match][0]} - ${this.resultsOfRound[match][1]} ${this.matchDays[match][1]} => ${this.teamsToNextRound[match]}`)
            } else {
                console.log(`${this.matchDays[match][0]} ${this.resultsOfRound[match][0]} - ${this.resultsOfRound[match][1]} ${this.matchDays[match][1]} => ${this.teamsToThirdPlace[match]}`)
            }
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

    winners(mode) {
        // Store who passes to the next round
        if (mode == NORMAL_MODE) {
            this.teamsToNextRound = [];
            this.teamsEliminated = [];
            for(const match in this.matchDays) {
                if (this.resultsOfRound[match][0] > this.resultsOfRound[match][1]) {
                    this.teamsToNextRound.push(this.matchDays[match][0])
                    this.teamsEliminated.push(this.matchDays[match][1])
                } else {
                    this.teamsToNextRound.push(this.matchDays[match][1])
                    this.teamsEliminated.push(this.matchDays[match][0])
                };          
            }      
        }
        // When in THIRD_PLACE_MODE store who wins the third place
        else {
            for(const match in this.matchDays) {
                if (this.resultsOfRound[match][0] > this.resultsOfRound[match][1]) {
                    this.teamsToThirdPlace.push(this.matchDays[match][0])
                } else {
                    this.teamsToThirdPlace.push(this.matchDays[match][1])
                };          
            }      
        }
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
    // Actyally execute the round
    worldCupPlayOffs.newRound(worldCupPlayOffs.teamsToNextRound, NORMAL_MODE);

    // Print on screen headers for each round
    switch(worldCupPlayOffs.teamsToNextRound.length) {
        case 8:
            console.log('\n===== CUARTOS DE FINAL =====\n');
            break;
        case 4:
            console.log('\n===== SEMIFINALES =====\n');
            break;
        case 2:
            console.log('\n===== TERCER Y CUARTO PUESTO =====\n');
            worldCupPlayOffs.newRound(worldCupPlayOffs.teamsEliminated, THIRD_PLACE_MODE);
            console.log('\n===== FINAL =====\n');
            break;
        case 1:
            console.log(`\n=========================================\n🏆 ¡ ${worldCupPlayOffs.teamsToNextRound[0]} campeón del mundo ! 🎉\n=========================================`);
           
    }
    // console.log('NEW ROUND');
    
}