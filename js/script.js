loadData("data/seasonData.csv").then(data => {

    console.log(data);

    function updateGame(gamefile) {
    	loadData(gamefile).then(gameData => {
    		// Call any methods that need to be done using the data for the specific game (e.g. updating the game data shown in the game detail panel)
    	});
    	// This function will update which game is selected fordetailed viewing on the charts. Also loads the data for the seelcted game into memory. Call methods in other classes here.
    }

    function updateTeam(team) {
    	// This will update the team selected (e.g. if we want to highlight the line from a specific team on both the bump chart and the final season chart at the same time)
    }

    let bumpChart = new BumpChart(data, updateGame, updateTeam);
    let finalSesaonChart = new SeasonTable(data, updateTeam);
    let gameTable = new GameTable(data, updateGame, updateTeam);
    let gameDetail = new GameDetail(updateGame);
});

async function loadData(filename) {
    let data = {}; // Load the data (this is just a placeholder so there are no syntax errors prior to implementation)
    return data;
}
