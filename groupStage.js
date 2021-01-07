var fs = require("fs");
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

class League {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams;
        this.groups = {};
    };

    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    printTeams(teams) {
        console.log(this.name, this.shuffleTeams(teams))
    };

    setGroups(teams) {
        let groupId = 97;
        let teamId = 0;
        for (let i = 0; i < teams.length; i = i + 4) {           
            this.groups[String.fromCharCode(groupId)] = [];
            
            
            for (let j = 0; j < 4; j++) {
                this.groups[String.fromCharCode(groupId)].push(teams[teamId])
                teamId++;
            };
            groupId++;
            
        }
        console.log(this.groups)

    }
}

const groupStage = new League('groups', teams)
groupStage.setGroups(groupStage.shuffleTeams(teams))