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
        this.winners = [];
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
        const winners = []

        // Init schedule
        let fixture = [];
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

        
        // Create an array of 4 objects to store the results of each team in the group
        const groupStandings = [
            { teamName: group[0], points: null, goalsFor: null, goalsAgainst: null, goalsDiff: null },
            { teamName: group[1], points: null, goalsFor: null, goalsAgainst: null, goalsDiff: null },
            { teamName: group[2], points: null, goalsFor: null, goalsAgainst: null, goalsDiff: null },
            { teamName: group[3], points: null, goalsFor: null, goalsAgainst: null, goalsDiff: null },
        ]
         
        
        // Print rounds' results
        for (let i = 0; i < rounds; i++) {
            console.log('---------')
            console.log(`Jornada ${i}`)
            console.log('---------')  
            for (let j = 0; j < matchesPerRound; j++) {
                console.log(`${fixture[i][j][0]} ${groupResults[i][j][0]} - ${groupResults[i][j][1]} ${fixture[i][j][1]}`);
                // Update standings after match result is known
                // When HOME TEAM team wins
                if (groupResults[i][j][0] > groupResults[i][j][1]) {
                    // Find who won and who lost
                    let winningTeam = fixture[i][j][0];
                    let losingTeam = fixture[i][j][1];
                    // Find winner's and loser's positions in the groupStandings array
                    let winnerToUpdate = null;
                    let loserToUpdate = null;
                    for (let l = 0; l <= 3; l++) {
                        if (groupStandings[l].teamName == winningTeam) {
                            winnerToUpdate = l
                        }
                        if (groupStandings[l].teamName == losingTeam) {
                            loserToUpdate = l
                        }
                    }
                
                    //Update winner's standings
                    groupStandings[winnerToUpdate].points += 3;
                    groupStandings[winnerToUpdate].goalsFor += groupResults[i][j][0];
                    groupStandings[winnerToUpdate].goalsAgainst += groupResults[i][j][1];
                    groupStandings[winnerToUpdate].goalsDiff += (groupResults[i][j][0] - groupResults[i][j][1]);

                    // Update loser's standings
                    groupStandings[loserToUpdate].points += 0;
                    groupStandings[loserToUpdate].goalsFor += groupResults[i][j][1];
                    groupStandings[loserToUpdate].goalsAgainst += groupResults[i][j][0];
                    groupStandings[loserToUpdate].goalsDiff += (groupResults[i][j][1] - groupResults[i][j][0]);

                // When AWAY TEAM team wins
                } else if (groupResults[i][j][0] < groupResults[i][j][1]) {          
                    // Find who won and who lost
                    let winningTeam = fixture[i][j][1];
                    let losingTeam = fixture[i][j][0];
                    // Find winner's and loser's positions in the groupStandings array
                    let winnerToUpdate = null;
                    let loserToUpdate = null;
                    for (let l = 0; l <= 3; l++) {
                        if (groupStandings[l].teamName == winningTeam) {
                            winnerToUpdate = l
                        }
                        if (groupStandings[l].teamName == losingTeam) {
                            loserToUpdate = l
                        }
                    }

                    //Update winner's standings
                    groupStandings[winnerToUpdate].points += 3;
                    groupStandings[winnerToUpdate].goalsFor += groupResults[i][j][0];
                    groupStandings[winnerToUpdate].goalsAgainst += groupResults[i][j][1];
                    groupStandings[winnerToUpdate].goalsDiff += (groupResults[i][j][0] - groupResults[i][j][1])

                    // Update loser's standings
                    groupStandings[loserToUpdate].points += 0;
                    groupStandings[loserToUpdate].goalsFor += groupResults[i][j][1]
                    groupStandings[loserToUpdate].goalsAgainst += groupResults[i][j][0]
                    groupStandings[loserToUpdate].goalsDiff += (groupResults[i][j][1] - groupResults[i][j][0])
                
                // When match is a DRAW
                } else {
                    let team1 = fixture[i][j][0];
                    let team2 = fixture[i][j][1];
                    // Find team1's position in the groupStandings array
                    let team1ToUpdate = null;
                    let team2ToUpdate = null;
                    for (let l = 0; l <= 3; l++) {
                        if (groupStandings[l].teamName == team1) {
                            team1ToUpdate = l
                        }
                        if (groupStandings[l].teamName == team2) {
                            team2ToUpdate = l
                        }
                    }

                    //Update home team's standings
                    groupStandings[team1ToUpdate].points += 1;
                    groupStandings[team1ToUpdate].goalsFor += groupResults[i][j][0];
                    groupStandings[team1ToUpdate].goalsAgainst += groupResults[i][j][1];
                    groupStandings[team1ToUpdate].goalsDiff += (groupResults[i][j][0] - groupResults[i][j][1])

                    // Update away team's standings
                    groupStandings[team2ToUpdate].points += 1;
                    groupStandings[team2ToUpdate].goalsFor += groupResults[i][j][1]
                    groupStandings[team2ToUpdate].goalsAgainst += groupResults[i][j][0]
                    groupStandings[team2ToUpdate].goalsDiff += (groupResults[i][j][1] - groupResults[i][j][0])
                }
              
            }
            console.table(groupStandings)
            
        }
        // Print winners of group
        function compare( a, b ) {
            if (a.points < b.points) {
                return 0;
            } 
            if (a.points > b.points) {
                return -1;
            }
            return -1;
        }
        
        groupStandings.sort(compare);
        this.winners.push(groupStandings[0].teamName, groupStandings[1].teamName);
        console.log(`Pasan a la siguiente fase: ${winners[0]} y ${winners[1]}`);
    };
    
}

const groupStage = new League('groups', teams)
groupStage.setGroups(groupStage.shuffleTeams(teams))
let groupId = 65;
for (const group of groupStage.groups) {
    console.log(" ");
    console.log("#################");
    console.log("##             ##");
    console.log(`##   GRUPO ${String.fromCharCode(groupId)}   ##`);
    console.log("##             ##");
    console.log("#################");
    groupStage.setSchedule(group);
    groupId++;
}
console.log(groupStage.winners)