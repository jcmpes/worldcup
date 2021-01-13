import { NORMAL_MODE, THIRD_PLACE_MODE }  from './classes/Playoffs.js';

// Import teams from txt local file
import fs from 'fs';
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

// import Championship from './classes/Championship.js'
import Playoffs from './classes/Playoffs.js';
import League from './groupStage.js';

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
const teamsToPlayoffs = groupStage.winners

const worldCupPlayOffs = new Playoffs;
worldCupPlayOffs.teamsToNextRound = worldCupPlayOffs.shuffleTeams(teamsToPlayoffs);
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
            console.log(`\n=========================================\n🏆 ¡ ${worldCupPlayOffs.teamsToNextRound[0]} campeón del mundo ! 🎉\n=========================================\n`);       
    }
}