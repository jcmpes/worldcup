// Define normal playoffs mode and third place mode
const NORMAL_MODE = 0;
const THIRD_PLACE_MODE = 1;

// Import teams from txt local file
// var fs = require("fs");
import fs from 'fs';
var text = fs.readFileSync("./16teams.txt");
const teams = text.toString().split("\n");

// import Championship from './classes/Championship.js'
import Playoffs from './classes/Playoffs.js'


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
            console.log(`\n=========================================\n🏆 ¡ ${worldCupPlayOffs.teamsToNextRound[0]} campeón del mundo ! 🎉\n=========================================\n`);       
    }
}