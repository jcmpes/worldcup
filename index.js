import { NORMAL_MODE, THIRD_PLACE_MODE }  from './classes/Playoffs.js';

// Import teams from txt local file
import fs from 'fs';
var text = fs.readFileSync("./teams.txt");
const teams = text.toString().split("\n");

// import Championship from './classes/Championship.js'
import Playoffs from './classes/Playoffs.js';
import League from './groupStage.js';

const groupStage = new League('groups', teams)

console.log(`
==================================================
               COMIENZO DEL MUNIDAL 
==================================================

==================================================
=========== COMIENZA LA FASE DE GRUPOS ===========
==================================================

`)

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

// Show who passes to the playoffs
console.log('');
console.log('Estos son los equipos que pasan de fase:')
console.log(groupStage.winners)

// Prepare teams to start the playoffs
const teamsToPlayoffs = groupStage.winners
const worldCupPlayOffs = new Playoffs;

// Get teams in groups of 4 and swap indexes 0 and 1
const teamsSwapped = []
for (let i = 0; i < teamsToPlayoffs.length; i = i + 4) {
    teamsSwapped.push(teamsToPlayoffs.slice(i, i+4))
    const fourTeams = teamsSwapped[teamsSwapped.length - 1]
    const temp = fourTeams[0]
    fourTeams[0] = fourTeams[1] 
    fourTeams[1] = temp
}
const teamsToStartPlayOffs = [...teamsSwapped[0], ...teamsSwapped[1], ...teamsSwapped[2], ...teamsSwapped[3]]
worldCupPlayOffs.teamsToNextRound = teamsToStartPlayOffs;
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