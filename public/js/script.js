Promise.all([d3.csv('./data/seasonData.csv'), d3.csv('./data/teamInfo.csv')]).then(data => {

    // No team/game selected by default
    this.activeTeam = null;
    this.activeGame = null;

    let that = this;
    let seasonData = data[0];
    window.teamData = data[1]; // Contains data such as team names, abbreviations, and logos. Useful across entire project, so using global variable

    function updateGame(gameID) {
        if (this.activeGame === gameID) {
            this.activeGame = null;
            gameDetail.clearGame();
            gameTable.selectGame(null);
        } else {
            this.activeGame = gameID;
            gameDetail.showGame(gameID);
            gameTable.selectGame(gameID);
        }
    }

    function updateTeam(teamID) {
        if (this.activeTeam === teamID) {
            this.activeTeam = null;
            finalSeasonChart.clearTeam();
            gameTable.clearTeam();
            bumpChart.clearTeam();
        } else {
            this.activeTeam = teamID;
            finalSeasonChart.selectTeam(teamID);
            gameTable.selectTeam(teamID);
            bumpChart.selectTeam(teamID);
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
