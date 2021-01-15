// import fs from 'fs';
// var text = fs.readFileSync("./teams.txt");
// const teams = text.toString().split("\n");

import Championship from './classes/Championship.js'

export default class League extends Championship {
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
        const groupResultsRecord = []

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
                    // Resgister victory to clearing standings in the event og tie in the points later on
                    const newResultRecord = new Array()
                    newResultRecord.push(fixture[i][j][0] , fixture[i][j][1], "won")
                    groupResultsRecord.push(newResultRecord)

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
                    // Resgister victory to determine standings in the event og tie in the points later on
                    const newResultRecord = new Array()
                    newResultRecord.push(fixture[i][j][0], fixture[i][j][1], "lost")
                    groupResultsRecord.push(newResultRecord)
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
                    // Resgister draw to determine standings in the event og tie in the points later on
                    const newResultRecord = new Array()
                    newResultRecord.push(fixture[i][j][0], fixture[i][j][1], "draw")
                    groupResultsRecord.push(newResultRecord)

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

        let teamsInDraw = []
        const drawsCounter = {}
        drawsCounter[group[0]] = 0
        drawsCounter[group[1]] = 0
        drawsCounter[group[2]] = 0
        drawsCounter[group[3]] = 0



        // Print winners of group
        function compare( a, b ) {
            // Sort by points
            if (a.points < b.points) {
                return 1;
            } 
            if (a.points > b.points) {
                return -1;
            }
            // In the event of a draw determine who won in the last match against the other team

            teamsInDraw = groupStandings.filter(team => team.points == a.points)
            for (const team of teamsInDraw) {
                team.wins = 0;
            }
            // In case of threefold or fourfold draw
            if (teamsInDraw.length > 2) {
                // mini league system
                for (let i = 0; i < teamsInDraw.length; i++) {
                    for (let j = 0; j < groupResultsRecord.length; j++) {
                        if (teamsInDraw[i].teamName == groupResultsRecord[j][0] && teamsInDraw.some(team => team.teamName == groupResultsRecord[j][1])) {
                            if (groupResultsRecord[j][2] == 'won') {
                                teamsInDraw[i].wins += 1
                            }
                        }
                        if (teamsInDraw[i].teamName == groupResultsRecord[j][1] && teamsInDraw.some(team => team.teamName == groupResultsRecord[j][0])) {
                            if (groupResultsRecord[j][2] == 'lost') {
                                teamsInDraw[i].wins += 1
                            }
                        }
                    }
                }
            } else if (teamsInDraw.length == 2) {
                // In case of simple points draw resolve for the two teams
                for(let i = 0; i < groupResultsRecord.length; i++) {
                    if (groupResultsRecord[i][0] == a.teamName && groupResultsRecord[i][1] == b.teamName) {
                        if (groupResultsRecord[i][2] == "won") {
                            drawsCounter[a.teamName] += 1;
                        }
                        if (groupResultsRecord[i][2] == "lost") {
                            drawsCounter[b.teamName] += 1;           
                        }
                        if (groupResultsRecord[i][2] == "draw") {
                        }
                        // In the event of a draw, sort by goalsDiff
                        if (a.goalsDiff < b.goalsDiff) {
                            return 1;
                        }
                        if (a.goalsDiff > b.goalsDiff) {
                            return -1;
                        }
                        // In the event of a draw, do alphabetic sort
                        if (a.teamName < b.teamName) {
                            return -1;
                        }
                        if (a.teamName > b.teamName) {
                            return 1;
                        }                   
                    }             
                    if (groupResultsRecord[i][1] == a.teamName && groupResultsRecord[i][0] == b.teamName) {
                        if (groupResultsRecord[i][2] == "won") {
                            drawsCounter[b.teamName] += 1;
                        }
                        if (groupResultsRecord[i][2] == "lost") {
                            drawsCounter[a.teamName] += 1;            
                        }
                        if (groupResultsRecord[i][2] == "draw") {
                        }
                        // In the event of a draw, sort by goalsDiff
                        if (a.goalsDiff < b.goalsDiff) {
                            return 1;
                        }
                        if (a.goalsDiff > b.goalsDiff) {
                            return -1;
                        }
                        // In the event of a draw, do alphabetic sort
                        if (a.teamName < b.teamName) {
                            return -1;
                        }
                        if (a.teamName > b.teamName) {
                            return 1;
                        }
                            
                    }
                }
            }
            return -1;
        }
        
        const standingsSorted = groupStandings.sort(compare)
        console.table(standingsSorted);
        
        this.winners.push(groupStandings[0].teamName, groupStandings[1].teamName);
        console.log(`Pasan a la fase eliminitoria: ${this.winners[this.winners.length - 2]} y ${this.winners[this.winners.length - 1]}`);
    };
    
}


