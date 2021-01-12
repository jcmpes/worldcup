import fs from 'fs';
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

import Championship from './classes/Championship.js'

class League extends Championship{
    constructor(name, teams) {
        super();
        this.name = name;
        this.teams = teams;
        this.groups = [];
        this.schedule = [];
        this.results = [];
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    printTeams(teams) {
        console.log(this.name, this.shuffleTeams(teams))
    };

    setGroups(teams) {
        let teamId = 0;
        // Generate n groups where n = teams.length / 4
        for (let i = 0; i < 8; i++) {  
            this.groups[i] = [];         
            
            // Fill groups with 4 teams each          
            for (let j = 0; j < 4; j++) {
                this.groups[i].push(teams[teamId]);
                teamId++;
            };           
        }
        console.log(this.groups);
    }

    setSchedule(group) {
        const numberOfTeams = group.length;
        const rounds = numberOfTeams - 1;
        const matchesPerRound = numberOfTeams / 2;

        // Init schedule
        const fixture = [];
        for (let i = 0; i < rounds; i++) {
            const round = [];
            for (let j = 0; j < matchesPerRound; j++) {
                const match = ['Local', 'Away'];
                round.push(match);
            }
            fixture.push(round);
        }
        this.schedule.push(fixture);

        // Add local teams
        this.schedule.forEach(fixture => {
            let teamId = 0;
            fixture.forEach(round => {
                round.forEach(match => {
                    match[0] = group[teamId];
                    if(teamId < 2) {
                        teamId++;
                    } else {
                        teamId = 0;
                    }
                });
                
            });
        });
        

        // Add away teams
        this.schedule.forEach(fixture => {
            let teamId = numberOfTeams - 2;
            fixture.forEach(round => {
                round[1][1] = group[teamId];
                teamId--;
            })
        })
        

        // Add last team as away team in each round's first match
        this.schedule.forEach(fixture => {
            fixture.forEach(round => {
                round[0][1] = group[numberOfTeams - 1]
            })
        })
        

        // Fix last team as local team every other round
        this.schedule.forEach(fixture => {
            let roundNumber = 0;
            fixture.forEach(round => {
                if(roundNumber % 2 != 0) {
                    const exLocalTeam = round[0][0];
                    round[0][0] = round[0][1];
                    round[0][1] = exLocalTeam;
                }
            roundNumber++;
            })
            
        })
        console.table(fixture);

        // Generate results
        const groupResults = []
        for (let i = 0; i < rounds; i++) {
            const roundResults = [];
            for (let j = 0; j < matchesPerRound; j++) {
                const matchResults = this.playMatch();
                roundResults.push(matchResults)
            }
            groupResults.push(roundResults)
        }
        this.results.push(groupResults)
    }

}

const groupStage = new League('groups', teams)
groupStage.setGroups(groupStage.shuffleTeams(teams))
for (const group of groupStage.groups) {
    groupStage.setSchedule(group);
}
for (let i = 0; i < groupStage.results.length; i++) {
    console.table(groupStage.results[i])
}
