Promise.all([d3.csv('./data/seasonData.csv'), d3.csv('./data/teamInfo.csv')]).then(data => {

    console.log(data);
    // No team selected by default
    this.activeTeam = null;

    let that = this;
    let seasonData = data[0];
    window.teamData = data[1]; // Contains data such as team names, abbreviations, colors, and logos. Useful across entire project, so using global variable

    function updateGame(gamefile) {
    	loadData(gamefile).then(gameData => {
            // Call any methods that need to be done using the data for the specific game (e.g. updating the game data shown in the game detail panel)
            // bumpChart.updateHighlightClick();
            // finalSeasonChart.updateHighlightClick();
            // gameTable.updateHighlightClick();
            // gameDetail.updateHighlightClick();
    	});
    	// This function will update which game is selected fordetailed viewing on the charts. Also loads the data for the selected game into memory. Call methods in other classes here.
    }

    function updateTeam(teamID) {
    	// This will update the team selected (e.g. if we want to highlight the line from a specific team on both the bump chart and the final season chart at the same time)
        that.activeTeam = teamID;
        if (teamID === null) {
            finalSeasonChart.clearHighlight();
            // bumpChart.clearHighlight();
            that.activeTeam = null;
        } else {
            that.activeTeam = teamID;
            finalSeasonChart.updateHighlightClick(teamID);
            gameTable.updateHighlightClick(teamID);
            // bumpChart.updateHighlightClick(teamID);
        }
       
    }



    let wrapperDiv = d3
    .select(".wrapper");

    wrapperDiv
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

    let bumpChart = new BumpChart(seasonData, updateGame, updateTeam);
    let finalSeasonChart = new SeasonTable(seasonData, updateTeam);
    let gameTable = new GameTable(seasonData, updateGame, updateTeam);
    let gameDetail = new GameDetail(updateGame);

    // Clears a finalSeasonChart selection by listening for a click
    var seasonChartElement = document.getElementById('season-chart');
    seasonChartElement.addEventListener("click", function (e) {
        updateTeam(null);
    }, true);
});

async function loadData(filename) {
    let data = await d3.csv(filename);
    return data;
}

/**
 * Returns html that can be used to render the tooltip.
 * @param data
 * @returns {string}
 */
function tooltipRender(data) {
		let text = "<span class='tooltiptext'>Team: " + data.team + "<br>Points: " + data.points + "</span>";
		return text;
	}

