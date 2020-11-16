/** Class implementing the season summary table view. */
class SeasonTable {

    constructor(data, updateTeam) {
        this.data = data;
        this.updateTeam = updateTeam;

        this.margin = { top: 70, right: 10, bottom: 10, left: 30 }
        this.width = 480 - this.margin.left - this.margin.right;
        this.height = 580 - this.margin.top - this.margin.bottom;

        this.drawChart();
    }

	drawChart() {
		let that = this;

    	let svgGroup = d3.select("#season-chart").append("svg").attr("id","season-chart-svg");

    	let totalPoints = this.calcTotalPoints();

    	let xScale = d3.scaleLinear().domain([0,d3.max(totalPoints, d => d.points)]).range([0, this.width]);

		let barGroups = svgGroup.selectAll("g").enter().data(totalPoints).join("g");
		
        barGroups.attr("transform", (d, i) => "translate(0, " + (this.height * i / (totalPoints.length + 1) + this.margin.top) + ")");
        let teamLabels = barGroups.append("text").text(d => d.team).classed("season-summary-label",true).attr("transform", "translate(0, " + 6 + ")")

		let rects = barGroups.append("rect").attr("transform", d => "translate(" + this.margin.left + ", 0)")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", d => xScale(d.points))
			.attr("height", 12);

		// Mouseover for rects
		rects
			.on("mouseover", (event, d, i) => {
				d3.select("#tooltip")
					.transition()
					.duration(200)
					.style("opacity", 0.9);
				d3.select("#tooltip")
					.html(tooltipRender(d) + "<br/>")
					.style("left", event.pageX + 5 + "px")
					.style("top", event.pageY - 28 + "px");
			});
		
		// Mouseout for rects
		rects
			.on("mouseout", function (event, d, i) {
				d3.select("#tooltip")
					.transition()
					.duration(500)
					.style("opacity", 0);
			});
		
		// Click function for rect selection
        rects.on('click', (event, d) => {
			console.log("event: ", event);
			console.log("d: ", d);

			let teamID = d.team;
            that.clearHighlight();
			that.updateTeam(teamID);

			if (this.activeTeam) {
            	that.updateHighlightClick(activeTeam);
        	}
        });
        rects.attr("class", d => "season-summary-rect " + d.team.toLowerCase());

        svgGroup.append("text").text("End-of-season points").attr("x", 190).attr("y", this.margin.top - 60).classed("axis-label",true);
    	svgGroup.append("g").attr("id", "seasonChartXAxis").attr("transform", "translate(" + this.margin.left + ", " + (this.margin.top - 50) + ")").classed("axis", true).call(d3.axisBottom().scale(xScale));
	}
	

    calcTotalPoints() {

    	let pointTotals = [];

    	for (let i of window.teamData) {
    		pointTotals.push({team: i.name_abbr, points: 0});
    	}

    	for (let i of this.data) {
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

	updateHighlightClick(activeTeam) {
		this.clearHighlight();
		// highlight rects
        let rectTeam = d3.select('#season-chart').selectAll('rect')
			.filter(b => b.team === activeTeam)
			.classed('selected-team', true);
        let hiddenRects = d3.select('#season-chart').selectAll('rect')
            .filter(b => b.team !== activeTeam)
            .classed('hidden', true)

	}

	clearHighlight() {
 		d3.select('#season-chart').selectAll('.selected-team')
				.classed('selected-team', false);
		d3.select('#season-chart').selectAll('.hidden')
            .classed('hidden', false);
	}
}
