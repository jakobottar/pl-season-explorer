Promise.all([d3.csv('./data/seasonData.csv'), d3.csv('./data/teamInfo.csv')]).then(data => {

    console.log(data);

    let seasonData = data[0];
    window.teamData = data[1]; // Contains data such as team names, abbreviations, colors, and logos. Useful across entire project, so using global variable

    function updateGame(gamefile) {
    	loadData(gamefile).then(gameData => {
    		// Call any methods that need to be done using the data for the specific game (e.g. updating the game data shown in the game detail panel)
    	});
    	// This function will update which game is selected fordetailed viewing on the charts. Also loads the data for the seelcted game into memory. Call methods in other classes here.
    }

    function updateTeam(team) {
    	// This will update the team selected (e.g. if we want to highlight the line from a specific team on both the bump chart and the final season chart at the same time)
    }

    let bumpChart = new BumpChart(seasonData, updateGame, updateTeam);
    let finalSesaonChart = new SeasonTable(seasonData, updateTeam);
    let gameTable = new GameTable(seasonData, updateGame, updateTeam);
    let gameDetail = new GameDetail(updateGame);
});

async function loadData(filename) {
    let data = await d3.csv(filename);
    return data;
}
