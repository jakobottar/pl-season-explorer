/** Class implementing the game summary table. */
class GameTable {

    constructor(data, updateGame, updateTeam) {
        this.data = data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.margin = { top: 60, right: 10, bottom: 10, left: 80 }
        this.width = 980 - this.margin.left - this.margin.right;
        this.height = 480 - this.margin.top - this.margin.bottom;

        this.drawChart();
    }

    drawChart() {

    	let svgGroup = d3.select("#game-table").append("svg").attr("id","game-table-svg");
    	let that = this;
    	let teams = this.determineTeams();
        let tooltip = d3.select("#game-table").append("div").attr("class", "tooltip").style("display", "none").style("opacity", 0);


    	let [maxMarginHomeWin, maxMarginAwayWin] = d3.extent(this.data, d => d.home_team_goal_count - d.away_team_goal_count);
    	let homeWinColorScale = d3.scaleLinear().domain([1, maxMarginHomeWin]).range(["white", "royalblue"]);
        let awayWinColorScale = d3.scaleLinear().domain([maxMarginAwayWin, -1]).range(["lightsalmon", "white"]);

    	let cellGroups = svgGroup.selectAll("g").data(this.data).join("g").classed("game-group", true);
    	cellGroups.attr("transform", function(d) {
    		let position = that.calcPosition(d, teams);
    		return "translate(" + (position[0] * that.width / teams.length + that.margin.left) + ", " + (position[1] * that.height / teams.length + that.margin.top) + ")";
    	});

    	let rects = cellGroups.append("rect").classed("game-rect", true).attr("x", 0).attr("y", 0).attr("width", this.width / 20).attr("height", this.height / 20);
    	rects.style("fill", function(d) {
            if (d.away_team_goal_count > d.home_team_goal_count) {
                return awayWinColorScale(d.away_team_goal_count - d.home_team_goal_count);
            } else if (d.away_team_goal_count < d.home_team_goal_count) {
                return homeWinColorScale(d.away_team_goal_count - d.home_team_goal_count);
            } else {
                return "white";
            }
        });

        let texts = cellGroups.append("text").classed("game-text", true).attr("transform", "translate(" + this.width / teams.length / 3 + ", " + this.height / teams.length / 1.5 + ")");
        texts.text(d => d.home_team_goal_count + "\u2013" + d.away_team_goal_count);

        for (let i = 0; i < teams.length; i++) {
            let xHeaderGroup = svgGroup.append("g").attr("transform", "translate(" + (this.width * i / teams.length + this.margin.left) + ", 0)");
            let yHeaderGroup = svgGroup.append("g").attr("transform", "translate(0, " + (this.height * i / teams.length + this.margin.top) + ")");
            let xRect = xHeaderGroup.append("rect").attr("x", this.width / teams.length / 10).attr("y", this.margin.top - 25).attr("width", this.width / teams.length / 1.2345).attr("height", 20);
            xRect.attr("class", "game-header-rect " + teams[i].toLowerCase());
            xHeaderGroup.append("text").attr("x", this.width / teams.length / 3.5).attr("y", this.margin.top - 11).text(teams[i]).classed("game-header-text", true);
            let yRect = yHeaderGroup.append("rect").attr("x", this.margin.left - 45).attr("y", this.height / teams.length / 10).attr("width", 35).attr("height", this.height / teams.length / 1.2345);
            yRect.attr("class", "game-header-rect " + teams[i].toLowerCase());
            yHeaderGroup.append("text").attr("x", this.margin.left - 40).attr("y", this.height / teams.length / 1.5).text(teams[i]).classed("game-header-text", true);
            let selfMatchRect = svgGroup.append("rect").classed("self-match-rect", true);
            selfMatchRect.attr("x", this.width * i / teams.length + this.margin.left).attr("y", this.height * i / teams.length + this.margin.top).attr("width", this.width / teams.length).attr("height", this.height / teams.length);
        }

        svgGroup.append("text").attr("x", 485).attr("y", 20).text("Away team").classed("game-table-axis-label", true);
        svgGroup.append("text").attr("x", 0).attr("y", 200).attr("transform", "rotate(270,60,240)").text("Home team").classed("game-table-axis-label", true);

        cellGroups.on("click", (event, d) => that.updateGame(d.game_id));
        cellGroups.on("mouseover", (event, d) => {
            tooltip.text("");
            tooltip.style("display", "block").transition().duration(200).style("opacity", 0.9);
            tooltip.style("left", (event.pageX + 5 - 10) + "px").style("top", (event.pageY - 28 - 700) + "px");
            tooltip.append("span").classed("tooltip-text", true).text(d.home_team_name + " " + d.home_team_goal_count + "\u2013" + d.away_team_goal_count + " " + d.away_team_name);
        });
        cellGroups.on("mouseout", () => {
            tooltip.transition().duration(500).on("end", () => tooltip.style("display", "none")).style("opacity", 0);
        });
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

    selectGame(gameID) {

        d3.selectAll(".game-rect").classed("selected-game", false);
        if (gameID !== null) {
            let rect = d3.selectAll(".game-rect").filter(d => d.game_id === gameID).classed("selected-game", true);
            d3.select(rect.node().parentNode).raise(); // Necessary to bring rect and accompanying text to front, so that border shows up correctly
        }
    }

    selectTeam(teamIDs) {
        this.clearTeams();
        d3.selectAll('.game-group').filter(d => !teamIDs.includes(window.teamData.find(e => e.name_long === d.home_team_name).name_abbr) && !teamIDs.includes(window.teamData.find(e => e.name_long === d.away_team_name).name_abbr)).classed('grayed', true);
    }

    clearTeams() {
        d3.select('#game-table').selectAll('.grayed').classed('grayed', false);
    }
}
