Promise.all([d3.csv('./data/seasonData.csv'), d3.csv('./data/teamInfo.csv')]).then(data => {

    // No teams/game selected by default
    this.activeTeams = [];
    this.activeGame = null;

    let that = this;
    let seasonData = data[0];
    window.teamData = data[1]; // Contains data such as team names, abbreviations, and logos. Useful across entire project, so using global variable

    function updateGame(gameID) {
        if (this.activeGame === gameID) {
            this.activeGame = null;
            bumpChart.clearGames();
            gameDetail.clearGame();
            gameTable.selectGame(null);
        } else {
            this.activeGame = gameID;
            bumpChart.selectGame(gameID);
            gameDetail.showGame(gameID);
            gameTable.selectGame(gameID);
        }
    }

    function updateTeam(teamID) {
    	if (teamID === "none") {
    		that.activeTeams = [];
        	finalSeasonChart.clearTeams();
        	gameTable.clearTeams();
        	bumpChart.clearTeams();
    	} else {
        	if (that.activeTeams.includes(teamID)) {
        	    that.activeTeams.splice(that.activeTeams.indexOf(teamID), 1);
        	    if (that.activeTeams.length === 0) {
        	        finalSeasonChart.clearTeams();
        	        gameTable.clearTeams();
        	        bumpChart.clearTeams();
        	    } else {
        	        finalSeasonChart.selectTeam(that.activeTeams);
        	        gameTable.selectTeam(that.activeTeams);
        	        bumpChart.selectTeam(that.activeTeams);
        	    }
        	} else {
        	    that.activeTeams.push(teamID);
        	    finalSeasonChart.selectTeam(that.activeTeams);
        	    gameTable.selectTeam(that.activeTeams);
        	    bumpChart.selectTeam(that.activeTeams);
        	}
    	}
    }

    let bumpChart = new BumpChart(seasonData, updateGame, updateTeam);
    let finalSeasonChart = new SeasonTable(seasonData, updateTeam);
    let gameTable = new GameTable(seasonData, updateGame, updateTeam);
    let gameDetail = new GameDetail(seasonData, updateGame);

});

async function loadData(filename) {
    let data = await d3.csv(filename);
    return data;
}
