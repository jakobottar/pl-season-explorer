/** Class implementing the game summary table. */
class GameTable {

    constructor(data, updateGame, updateTeam) {
        this.data = data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.margin = { top: 30, right: 10, bottom: 10, left: 50 }
        this.width = 980 - this.margin.left - this.margin.right;
        this.height = 480 - this.margin.top - this.margin.bottom;

        this.drawChart();
    }

    drawChart() {

    	let svgGroup = d3.select("#game-table").append("svg").attr("id","game-table-svg");
    	let that = this;
    	let teams = this.determineTeams();

    	let [maxMarginHomeWin, maxMarginAwayWin] = d3.extent(this.data, d => d.home_team_goal_count - d.away_team_goal_count);
    	let colorScale = d3.scaleDiverging().domain([maxMarginAwayWin, 0, maxMarginHomeWin]).range(["lightsalmon", "white", "royalblue"]);

    	let cellGroups = svgGroup.selectAll("g").data(this.data).join("g");
    	cellGroups.attr("transform", function(d) {
    		let position = that.calcPosition(d, teams);
    		return "translate(" + (position[0] * that.width / teams.length + that.margin.left) + ", " + (position[1] * that.height / teams.length + that.margin.top) + ")";
    	});

    	let rects = cellGroups.append("rect").classed("game-rect", true).attr("x", 0).attr("y", 0).attr("width", this.width / 20).attr("height", this.height / 20);
    	rects.style("fill", d => colorScale(d.away_team_goal_count - d.home_team_goal_count));

        let texts = cellGroups.append("text").classed("game-text", true).attr("transform", "translate(" + this.width / teams.length / 3 + ", " + this.height / teams.length / 1.5 + ")");
        texts.text(d => d.home_team_goal_count + "\u2013" + d.away_team_goal_count);

        for (let i = 0; i < teams.length; i++) {
            let xHeaderGroup = svgGroup.append("g").attr("transform", "translate(" + (this.width * i / teams.length + this.margin.left) + ", 0)");
            let yHeaderGroup = svgGroup.append("g").attr("transform", "translate(0, " + (this.height * i / teams.length + this.margin.top) + ")");
            let xRect = xHeaderGroup.append("rect").attr("x", this.width / teams.length / 10).attr("y", 5).attr("width", this.width / teams.length / 1.2345).attr("height", this.margin.top - 10);
            xRect.attr("class", "game-header-rect " + teams[i].toLowerCase());
            xHeaderGroup.append("text").attr("x", this.width / teams.length / 3.5).attr("y", 20).text(teams[i]).classed("game-header-text", true);
            let yRect = yHeaderGroup.append("rect").attr("x", 5).attr("y", this.height / teams.length / 10).attr("width", this.margin.left - 15).attr("height", this.height / teams.length / 1.2345);
            yRect.attr("class", "game-header-rect " + teams[i].toLowerCase());
            yHeaderGroup.append("text").attr("x", 10).attr("y", this.height / teams.length / 1.5).text(teams[i]).classed("game-header-text", true);
        }

        cellGroups.on("click", (event, d, i) => that.updateGame(d.game_id));

    }

    determineTeams() {

    	// This function allows for data from other seasons to be implemented as well (i.e. not hard-coding the teams)
    	let teams = [];
    	for (let i of this.data) {
    		if (!teams.includes(window.teamData.find(e => e.name_long === i.home_team_name).name_abbr)) {
    			teams.push(window.teamData.find(e => e.name_long === i.home_team_name).name_abbr);
    		}
    	}
    	return teams.sort();
    }

    calcPosition(matchData, teams) {

    	let xPos = teams.indexOf(window.teamData.find(e => e.name_long === matchData.away_team_name).name_abbr)
    	let yPos = teams.indexOf(window.teamData.find(e => e.name_long === matchData.home_team_name).name_abbr)
    	return [xPos, yPos];
    }

    updateHighlightClick(activeTeam) {
		this.clearHighlight();
		// highlight rects
        // let seasonTeamRects = d3.select('#game-table').selectAll('rect')
		// 	.filter(b => b.team === activeTeam)
		// 	.classed('selected-team', true);
        // let hiddenRects = d3.select('#game-table').selectAll('rect')
        //     .filter(b => b.team !== activeTeam)
        //     .classed('hidden', true)

	}

	clearHighlight() {
 		// d3.select('#game-table').selectAll('.selected-team')
		// 		.classed('selected-team', false);
		// d3.select('#game-table').selectAll('.hidden')
        //     .classed('hidden', false);
	}
}
