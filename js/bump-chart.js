/** Class implementing the bump chart. */
class BumpChart {

    constructor(data, updateGame, updateTeam) {
        this.data = data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.xAxis = "week";
        this.yAxis = "position";

        this.drawChart(this.xAxis, this.yAxis)
    }

    drawChart() {
        // Draw the chart, with appropriate axes
    }

}
