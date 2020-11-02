/** Class implementing the bump chart. */
class BumpChart {

    constructor(data, updateGame, updateTeam) {
        this.data = data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.xAxis = "week";
        this.yAxis = "position";

        drawChart(this.xAxis, this.yAxis)
    }

    drawChart() {
        // Draw the chart, with appropriate axes
    }

    changeAxes(xAxis, yAxis) {
    	// Change x-axis between week, game, and date; or y-axis between position, points, or ppg
    }

}
