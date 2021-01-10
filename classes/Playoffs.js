// Define normal playoffs mode and third place mode
export const NORMAL_MODE = 0;
export const THIRD_PLACE_MODE = 1;

import Championship from './Championship.js'

export default class Playoffs extends Championship {
    constructor(name, teams) {
        super(),
        this.teamsToNextRound = [],
        this.resultsOfRound = [],
        this.matchDays = [],
        this.teamsEliminated = [],
        this.teamsToThirdPlace = [],
        this.name = name,
        this.teams = teams
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