/** Class implementing the season summary table view. */
class SeasonTable {

    constructor(updateTeam) {
		this.data;
        this.updateTeam = updateTeam;

        this.margin = { top: 70, right: 10, bottom: 10, left: 30 }
        this.width = 480 - this.margin.left - this.margin.right;
        this.height = 580 - this.margin.top - this.margin.bottom;
	}
	
	setData(data) { this.data = data; }

	drawChart(data) {
		let that = this;
        d3.select("#season-chart").text("");

    	let svgGroup = d3.select("#season-chart").append("svg").attr("id","season-chart-svg");
    	let tooltip = d3.select("#season-chart").append("div").attr("class", "tooltip").style("display", "none").style("opacity", 0);
        let backgroundRect = svgGroup.append("rect").classed("season-chart-bgrect", true);

    	let totalPoints = this.calcTotalPoints(this.data);

    	let xScale = d3.scaleLinear().domain([0,d3.max(totalPoints, d => d.points)]).range([0, this.width]);

		let barGroups = svgGroup.selectAll("g").data(totalPoints).join("g");
		
        barGroups.attr("transform", (d, i) => "translate(0, " + (this.height * i / (totalPoints.length + 1) + this.margin.top) + ")");
        let teamLabels = barGroups.append("text").text(d => d.team).classed("season-summary-label",true).attr("transform", "translate(0, " + 6 + ")")

		let rects = barGroups.append("rect").attr("transform", d => "translate(" + this.margin.left + ", 0)");
		rects.attr("x", 0).attr("y", 0).attr("width", d => xScale(d.points)).attr("height", 12);
        rects.attr("class", d => "season-summary-rect " + d.team.toLowerCase());

		// Mouseover for rects
		rects.on("mouseover", (event, d) => {
			tooltip.text("");
			tooltip.style("display", "block").transition().duration(200).style("opacity", 0.9);
			tooltip.style("left", (event.pageX + 5 - 1000) + "px").style("top", (event.pageY - 28 - 240) + "px");
			tooltip.append("span").classed("tooltip-text", true).text("Team: " + window.teamData.find(e => e.name_abbr === d.team).name_long);
			tooltip.append("br")
			tooltip.append("span").classed("tooltip-text", true).text("Points: " + d.points);
		});
		
		// Mouseout for rects
		rects.on("mouseout", () => {
			tooltip.transition().duration(500).on("end", () => tooltip.style("display", "none")).style("opacity", 0);
		});
		
		// Click function for team selection
        rects.on("click", (event, d) => that.updateTeam(d.team));
        backgroundRect.on("click", () => that.updateTeam("none"));

        svgGroup.append("text").text("Points").attr("x", 190).attr("y", this.margin.top - 60).classed("axis-label",true);
    	svgGroup.append("g").attr("id", "seasonChartXAxis").attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top - 50) + ")").classed("axis", true).call(d3.axisBottom().scale(xScale));
	}
	

    calcTotalPoints(data) {

    	let pointTotals = [];

    	for (let i of window.teamData) {
    		pointTotals.push({team: i.name_abbr, points: 0});
    	}

    	for (let i of data) {
    		if (i.home_team_goal_count > i.away_team_goal_count) {
    			let index = pointTotals.findIndex(d => d.team === window.teamData.find(e => e.name_long === i.home_team_name).name_abbr);
    			pointTotals[index].points += 3;
    		} else if (i.home_team_goal_count < i.away_team_goal_count) {
    			let index = pointTotals.findIndex(d => d.team === window.teamData.find(e => e.name_long === i.away_team_name).name_abbr);
    			pointTotals[index].points += 3;
    		} else {
    			let index1 = pointTotals.findIndex(d => d.team === window.teamData.find(e => e.name_long === i.home_team_name).name_abbr);
    			let index2 = pointTotals.findIndex(d => d.team === window.teamData.find(e => e.name_long === i.away_team_name).name_abbr);
    			pointTotals[index1].points++;
    			pointTotals[index2].points++;
    		}
    	}

    	return pointTotals;
	}

	selectTeam(teamIDs) {
		this.clearTeams();
        d3.selectAll('.season-summary-rect').filter(b => teamIDs.includes(b.team)).classed('selected-team', true);
        d3.selectAll('.season-summary-rect').filter(b => !teamIDs.includes(b.team)).classed('grayed', true);
	}

	clearTeams() {
 		d3.selectAll('.season-summary-rect').classed('selected-team', false).classed('grayed', false);
	}

    updateWeeks(gameWeeks) {
        let selectedGames = this.data.filter(d => d.gameweek >= gameWeeks[0] && d.gameweek <= gameWeeks[1]);
        let points = this.calcTotalPoints(selectedGames);
        let xScale = d3.scaleLinear().domain([0,d3.max(points, d => d.points)]).range([0, this.width]);

        d3.selectAll(".season-summary-rect").data(points).transition().duration(500).attr("width", d => xScale(d.points));
        d3.select("#seasonChartXAxis").call(d3.axisBottom().scale(xScale));
    }
}
