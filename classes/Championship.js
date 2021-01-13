export default class Championship {
    shuffleTeams(teamsToShuffle) {
        const shuffledTeams = teamsToShuffle.sort(() => Math.random() - 0.5);
        return shuffledTeams;      
    };

    playMatchNoDraw() {
        let result = [0,0];
        while(result[0] == result[1]) {
            result = [
                Math.floor(Math.random() * 7),
                Math.floor(Math.random() * 7)              
            ]
        };
        return result
    };

    playMatch() {
        let result = [
            Math.floor(Math.random() * 7),
            Math.floor(Math.random() * 7)
        ];
        return result;
    }
}