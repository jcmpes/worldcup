import fs from 'fs';
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

class League {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams;
        this.groups = [];
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
        const fixture = [];
        const numberOfTeams = group.length;
        const rounds = numberOfTeams - 1;
        const matchesPerRound = numberOfTeams / 2;

        for (let i = 0; i < rounds; i++) {
            const round = [];
            for (let j = 0; j < matchesPerRound; j++) {
                const match = ['Local', 'Away'];
                round.push(match)
            }
            fixture.push(round)
            
        }
        console.table(fixture)
    }

}

const groupStage = new League('groups', teams)
groupStage.setGroups(groupStage.shuffleTeams(teams))
for (const group of groupStage.groups) {
    groupStage.setSchedule(group);

}