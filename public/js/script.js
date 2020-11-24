Promise.all([d3.csv('./data/seasonData.csv'), d3.csv('./data/teamInfo.csv')]).then(data => {
    // let that = this;
    // let seasonData = data[0];
    // window.teamData = data[1]; // Contains data such as team names, abbreviations, and logos. Useful across entire project, so using global variable

    // bumpChart.setData(seasonData)
    // bumpChart.drawChart()
    // let finalSeasonChart = new SeasonTable(seasonData, updateTeam);
    // let gameTable = new GameTable(seasonData, updateGame, updateTeam);
    // let gameDetail = new GameDetail(seasonData, updateGame);

});

async function loadData(filename) {
    let data = await d3.csv(filename);
    return data;
}

// No teams/game selected by default
activeTeams = [];
activeGame = null;

function updateGame(gameID) {
    if (activeGame === gameID) {
        activeGame = null;
        bumpChart.clearGames();
        gameDetail.clearGame();
        gameTable.selectGame(null);
    } else {
        activeGame = gameID;
        bumpChart.selectGame(gameID);
        gameDetail.showGame(gameID);
        gameTable.selectGame(gameID);
    }
}

function updateTeam(teamID) {
    if (teamID === "none") {
        activeTeams = [];
        finalSeasonChart.clearTeams();
        gameTable.clearTeams();
        bumpChart.clearTeams();
    } else {
        if (activeTeams.includes(teamID)) {
            activeTeams.splice(activeTeams.indexOf(teamID), 1);
            if (activeTeams.length === 0) {
                finalSeasonChart.clearTeams();
                gameTable.clearTeams();
                bumpChart.clearTeams();
            } else {
                finalSeasonChart.selectTeam(activeTeams);
                gameTable.selectTeam(activeTeams);
                bumpChart.selectTeam(activeTeams);
            }
        } else {
            activeTeams.push(teamID);
            finalSeasonChart.selectTeam(activeTeams);
            gameTable.selectTeam(activeTeams);
            bumpChart.selectTeam(activeTeams);
        }
    }
}

let bumpChart = new BumpChart(updateGame, updateTeam);
let finalSeasonChart = new SeasonTable(updateTeam);
let gameTable = new GameTable(updateGame, updateTeam);
let gameDetail = new GameDetail(updateGame);

Promise.all([loadData('./data/seasonData.csv'), loadData('./data/teamInfo.csv')]).then(data => {
    window.teamData = data[1]

    bumpChart.setData(data[0]);
    bumpChart.drawChart();

    finalSeasonChart.setData(data[0]);
    finalSeasonChart.drawChart();

    gameTable.setData(data[0]);
    gameTable.drawChart();

    gameDetail.setData(data[0]);
    gameDetail.drawDiv();
})
