/** Class implementing the bump chart. */
class BumpChart {

    constructor(updateGame, updateTeam) {
        this.data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.svg;
        this.size;
    }

    setData(data) { this.data = data; }

    drawChart() {
        let table = this.makeTable();
        let tooltip = d3.select("#bump-chart").append("div").attr("class", "tooltip").style("display", "none").style("opacity", 0);

        this.size = d3.select('#bump-chart').node().getBoundingClientRect();
        this.svg = d3.select('#bump-chart').append("svg");

        this.drawLines(table);
        this.drawDots(table);

        let that = this;
        let circles = d3.select("#bump-dots").selectAll("circle");
        circles.on("mouseover", (event, d) => {
            // TODO: highlight team
            tooltip.text("");
            tooltip.style("display", "block").transition().duration(200).style("opacity", 0.9);
            tooltip.style("left", (event.pageX + 5 - 10) + "px").style("top", (event.pageY - 28 - 200) + "px");
            tooltip.append("span").classed("tooltip-text", true).text(d.team_name);
            tooltip.append("br");
            tooltip.append("span").classed("tooltip-text", true).text("Points: " + d.points);
            tooltip.append("br");
            tooltip.append("span").classed("tooltip-text", true).text("Place: " + d.place);
        });
        circles.on("mouseout", () => {
            // TODO: clear team
            tooltip.transition().duration(500).on("end", () => tooltip.style("display", "none")).style("opacity", 0);
        });
        circles.on("click", (event, d) => {
            console.log(d);
            that.updateGame(d.game_id);
        })
    }
    
    makeTable(){

        function getPoints(forScore, againstScore){
            if(forScore > againstScore){ return 3; }
            else if(forScore < againstScore){ return 0; }
            else{ return 1; }
        }

        function sortTable(a, b){
            if(a.points > b.points){ return -1; }
            else if(a.points < b.points){ return 1; }
            else{
                if(a.gd > b.gd){ return -1; }
                else if(a.gd < b.gd){ return 1; }
                else{
                    if(a.gs > b.gs){ return -1; }
                    else if(a.gs < b.gs){ return 1; }
                    else{
                        if(a.team_name.toLowerCase() > a.team_name.toLowerCase()) { return 1; }
                        else if(a.team_name.toLowerCase() > a.team_name.toLowerCase()) { return -1; }
                        return 0;
                    }
                }
            }
        }

        let table = [];
        for(let i = 0; i < 38; i++){
            let gw = this.data.filter(d => +d.gameweek == i+1);
            let col = []
            if(i == 0){
                gw.forEach(e => {
                    col.push({
                        "team_name": e.home_team_name,
                        "team_abbr": window.teamData.find(d => d.name_long === e.home_team_name).name_abbr,
                        "points": getPoints(e.home_team_goal_count, e.away_team_goal_count),
                        "gd": e.home_team_goal_count - e.away_team_goal_count,
                        "gs": +e.home_team_goal_count,
                        "p_of_max_points": getPoints(e.home_team_goal_count, e.away_team_goal_count) / 3,
                        "game_id": e.game_id
                    });
                    col.push({
                        "team_name": e.away_team_name,
                        "team_abbr": window.teamData.find(d => d.name_long === e.away_team_name).name_abbr,
                        "points": getPoints(e.away_team_goal_count, e.home_team_goal_count),
                        "gd": e.away_team_goal_count - e.home_team_goal_count,
                        "gs": +e.away_team_goal_count,
                        "p_of_max_points": getPoints(e.away_team_goal_count, e.home_team_goal_count) / 3,
                        "game_id": e.game_id
                    });
                });

                col.sort(sortTable);
                for(let p = 1; p <= col.length; p++){ col[p-1].place = p; }
            }
            else{
                //NOTE: This breaks if there are <10 games per GW
                gw.forEach(e => {
                    //TODO: is there a better way to do this?
                    let home = Object.assign({}, table[i-1].find(d => d.team_name == e.home_team_name));
                    home.points += getPoints(e.home_team_goal_count, e.away_team_goal_count);
                    home.gd += e.home_team_goal_count - e.away_team_goal_count;
                    home.gs += +e.home_team_goal_count;
                    home.p_of_max_points = home.points / ((i+1)*3);
                    home.game_id = e.game_id;
                    home.prevPlace = home.place;
                    col.push(home);

                    let away = Object.assign({}, table[i-1].find(d => d.team_name == e.away_team_name));
                    away.points += getPoints(e.away_team_goal_count, e.home_team_goal_count);
                    away.gd += e.away_team_goal_count - e.home_team_goal_count;
                    away.gs += +e.away_team_goal_count;
                    away.p_of_max_points = away.points / ((i+1)*3);
                    away.game_id = e.game_id;
                    away.prevPlace = away.place;
                    col.push(away);
                });
                
                col.sort(sortTable)
                for(let p = 1; p <= col.length; p++){ col[p-1].place = p; }
            }

            table.push(col);
        }
        return table;
    }

    drawLines(table){
        let padding = 20;

        console.log(document.getElementById('y-axis-select').value)

        let xScale = d3.scaleLinear().domain([1, 38]).range([padding, this.size.width - padding]);

        let yScale = d3.scaleLinear().domain([1, 20]).range([padding, this.size.height - padding]);

        let lines = this.svg.append('g').attr('id', 'bump-lines').selectAll('line');
            
        for(let gw = 1; gw < 38; gw++){
                let games = table[gw]
                
                lines.data(games)
                    .enter()
                    .append('line')
                    .attr("x1", xScale(gw))
                    .attr("x2", xScale(gw+1))
                    .attr("y1", d => yScale(d.prevPlace))
                    .attr("y2", d => yScale(d.place))
        }

    }

    drawDots(table){
        let padding = 20;

        let xScale = d3.scaleLinear().domain([1, 38]).range([padding, this.size.width - padding])

        let yScale = d3.scaleLinear().domain([1, 20]).range([padding, this.size.height - padding])

        let dots = this.svg.append('g').attr('id', 'bump-dots').selectAll("circle");

        for(let gw = 0; gw < 38; gw++){
            let games = table[gw];
            
            dots.data(games).enter().append("circle")
                .attr("cx", xScale(gw + 1))
                .attr("cy", d => yScale(d.place))
                .attr("r", 7)
                .attr("class", d => d.team_abbr.toLowerCase());
        }
    }

    selectGame(gameID){
        this.clearGames();

        d3.selectAll('#bump-dots circle')
            .filter((d) => gameID === d.game_id)
            .classed('selected-game', true);
    }

    clearGames(){
        d3.selectAll('#bump-dots circle')
            .classed('selected-game', false);
    }

    selectTeam(teamIDs) {
		this.clearTeams();
        // Select the teams present in the array teamIDs
        d3.selectAll('#bump-dots circle').filter((d) => !teamIDs.includes(d.team_abbr)).classed('grayed', true);
        d3.selectAll('#bump-lines line').filter((d) => !teamIDs.includes(d.team_abbr)).classed('grayed', true);
      
        // Called when at a team is selected, and when a team is deselected and there are still other selected teams
	}

	clearTeams() {
        // Deselect all teams. Called when all teams are deselected, and from selectTeam
        d3.select('#bump-chart').selectAll('.grayed').classed('grayed', false);
	}
}
