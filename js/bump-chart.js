/** Class implementing the bump chart. */
class BumpChart {

    constructor(data, updateGame, updateTeam) {
        this.data = data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.xAxis = "week";
        this.yAxis = "position";

        this.svg;
        this.size;

        this.drawChart(this.xAxis, this.yAxis)
    }

    drawChart() {
        let table = this.makeTable();
        console.log(table)

        this.size = d3.select('#bump-chart').node().getBoundingClientRect()
        this.svg = d3.select('#bump-chart')
            .append("svg")

        this.drawLines(table)
        this.drawDots(table)
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
                        "gs": +e.home_team_goal_count
                    });
                    col.push({
                        "team_name": e.away_team_name,
                        "team_abbr": window.teamData.find(d => d.name_long === e.away_team_name).name_abbr,
                        "points": getPoints(e.away_team_goal_count, e.home_team_goal_count),
                        "gd": e.away_team_goal_count - e.home_team_goal_count,
                        "gs": +e.away_team_goal_count
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
                    col.push(home);

                    let away = Object.assign({}, table[i-1].find(d => d.team_name == e.away_team_name));
                    away.points += getPoints(e.away_team_goal_count, e.home_team_goal_count);
                    away.gd += e.away_team_goal_count - e.home_team_goal_count;
                    away.gs += +e.away_team_goal_count;
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
        //TODO:
    }

    drawDots(table){
        let padding = 20

        let xScale = d3.scaleLinear()
            .domain([1, 38])
            .range([padding, this.size.width - padding])

        let yScale = d3.scaleLinear()
            .domain([1, 20])
            .range([padding, this.size.height - padding])

        let dots = this.svg
            .append('g')
            .attr('id', 'bump-dots')

        for(let gw = 0; gw < 38; gw++){
            let games = table[gw]
            
            dots.selectAll("circles")
                .data(games)
                .enter()
                .append("circle")
                .attr("cx", xScale(gw + 1))
                .attr("cy", d => yScale(d.place))
                .attr("r", 7)
                .attr("class", d => d.team_abbr.toLowerCase())
                .append("svg:title")
                .text(d => d.team_name);
        }
    }   
}
