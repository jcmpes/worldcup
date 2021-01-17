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

    rearrange(arr) {
        const a = arr[1];
        arr[1] = arr[2];
        arr[2] = a;
        return arr
    }

    newRound(teamsToSchedule, mode) {
        // Schedule matches
        this.matchDays = [];
        if(teamsToSchedule.length <= 2) {
            for(let i = 0; i < teamsToSchedule.length; i = i+2) {
                this.matchDays.push(new Array(teamsToSchedule[i], teamsToSchedule[i+1]))
            };
        }
        if(teamsToSchedule.length > 2) {
            // Divide array in arrays of 4 items and rearrange [1, 0, 2, 3] => [1, 2, 0, 3]
            let arr = []
            let newArr = []
            for(let i = 0; i < teamsToSchedule.length; i = i+4) {
                arr.push(this.rearrange(teamsToSchedule.slice(i, i + 4)))
            }

            for (let j = 0; j < arr.length; j++) {        
                for (let k = 0; k < 4; k++) {
                    newArr.push(arr[j][k])

                }
            }
            
            for(let i = 0; i < newArr.length; i = i+2) {
                this.matchDays.push(new Array(newArr[i], newArr[i+1]))
            };
        } 

        // Play the matches
        this.resultsOfRound = [];
        this.matchDays.forEach(match => this.resultsOfRound.push(this.playMatchNoDraw()))


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