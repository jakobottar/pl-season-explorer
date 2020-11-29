/** Class implementing the bump chart. */
class BumpChart {

    constructor(updateGame, updateTeam) {
        this.data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;

        this.svg;
        this.size;

        this.table;
        this.brush;
        this.xScale;
    }

    setData(data) { this.data = data; }

    drawChart() {
        this.table = this.makeTable();
        let tooltip = d3.select('#bump-chart').append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);

        this.size = d3.select('#bump-chart').node().getBoundingClientRect();
        this.size.padding = {"top": 20, "bottom": 100, "left": 60, "right": 20};
        this.svg = d3.select('#bump-chart').append('svg');

        this.xScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right]);

        this.svg.append('g').attr('id', 'bump-lines')
        this.svg.append('g').attr('id', 'bump-dots')
        this.svg.append('g').attr('id', 'bump-x-axis')
        this.svg.append('g').attr('id', 'bump-y-axis')
        this.svg.append('g').attr('id', 'brush-wrapper')

        this.drawLines(this.table);
        this.drawDots(this.table);

        this.makeBrush()

        this.svg.append('text')
            .attr('id', 'y-axis-text')
            .attr('x', -((this.size.height - this.size.padding.bottom - this.size.padding.top)/2 + 10))
            .attr('y', 15)
            .attr('transform', 'rotate(-90)')
            .classed('axis-text', true)

        this.drawAxes('place');

        let circles = d3.select('#bump-dots').selectAll('circle');
        circles.on('mouseover', (event, d) => {
            // TODO: highlight team
            tooltip.text('');
            tooltip.style('display', 'block').transition().duration(200).style('opacity', 0.9);
            tooltip.style('left', (event.pageX + 5 - 10) + 'px').style('top', (event.pageY - 28 - 200) + 'px');
            tooltip.append('span').classed('tooltip-text', true).text(d.team_name);
            tooltip.append('br');
            tooltip.append('span').classed('tooltip-text', true).text('Points: ' + d.points);
            tooltip.append('br');
            tooltip.append('span').classed('tooltip-text', true).text('Place: ' + d.place);
        });
        circles.on('mouseout', () => {
            // TODO: clear team
            tooltip.transition().duration(500).on('end', () => tooltip.style('display', 'none')).style('opacity', 0);
        });
        circles.on('click', (event, d) => {
            console.log(d);
            this.updateGame(d.game_id);
        })

        // document.getElementById("bump-chart").addEventListener("click", _ => { 
        //     d3.select('#brush-wrapper').call(this.brush.move, null);
        //     this.clearZoom();
        // }); 

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
                        'team_name': e.home_team_name,
                        'team_abbr': window.teamData.find(d => d.name_long === e.home_team_name).name_abbr,
                        'points': getPoints(e.home_team_goal_count, e.away_team_goal_count),
                        'gd': e.home_team_goal_count - e.away_team_goal_count,
                        'gs': +e.home_team_goal_count,
                        'p_of_max_points': getPoints(e.home_team_goal_count, e.away_team_goal_count) / 3,
                        'game_id': e.game_id,
                        'gw': i+1
                    });
                    col.push({
                        'team_name': e.away_team_name,
                        'team_abbr': window.teamData.find(d => d.name_long === e.away_team_name).name_abbr,
                        'points': getPoints(e.away_team_goal_count, e.home_team_goal_count),
                        'gd': e.away_team_goal_count - e.home_team_goal_count,
                        'gs': +e.away_team_goal_count,
                        'p_of_max_points': getPoints(e.away_team_goal_count, e.home_team_goal_count) / 3,
                        'game_id': e.game_id,
                        'gw': i+1
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
                    home.prev_p_of_max_points = home.p_of_max_points;
                    home.p_of_max_points = home.points / ((i+1)*3);
                    home.game_id = e.game_id;
                    home.prev_place = home.place;
                    home.gw = i+1;
                    col.push(home);

                    let away = Object.assign({}, table[i-1].find(d => d.team_name == e.away_team_name));
                    away.points += getPoints(e.away_team_goal_count, e.home_team_goal_count);
                    away.gd += e.away_team_goal_count - e.home_team_goal_count;
                    away.gs += +e.away_team_goal_count;
                    away.prev_p_of_max_points = away.p_of_max_points;
                    away.p_of_max_points = away.points / ((i+1)*3);
                    away.game_id = e.game_id;
                    away.prev_place = away.place;
                    away.gw = i+1;
                    col.push(away);
                });
                
                col.sort(sortTable)
                for(let p = 1; p <= col.length; p++){ col[p-1].place = p; }
            }

            table.push(col);
        }
        return table;
    }

    updateChart(){
        let key = document.getElementById('y-axis-select').value;

        this.drawAxes(key)
        this.updatePosition(d3.select('#bump-lines').selectAll('line'), key, this.xScale);
        this.updatePosition(d3.select('#bump-dots').selectAll('circle'), key, this.xScale);
    }

    updatePosition(elements, key){
        let yScale = d3.scaleLinear().domain((key == 'place') ? [1, 20] : [1, 0]).range([this.size.padding.top, this.size.height - this.size.padding.bottom]);

        if(elements._groups[0][0].nodeName == 'line'){
            elements
                .transition()
                .duration(500)
                .attr('x1', d => this.xScale(d.gw-1))
                .attr('x2', d => this.xScale(d.gw))
                .attr('y1', d => yScale(d['prev_' + key]))
                .attr('y2', d => yScale(d[key]));
        }
        else{
            elements
                .transition()
                .duration(500)
                .attr('cx', d => this.xScale(d.gw))
                .attr('cy', d => yScale(d[key]));
        }
    }

    drawLines(table){
        let lines = d3.select('#bump-lines').selectAll('line');
        for(let gw = 1; gw < 38; gw++){
                let games = table[gw]
                
                lines.data(games)
                    .enter()
                    .append('line')
        }
        this.updatePosition(d3.select('#bump-lines').selectAll('line'), 'place')
    }

    drawDots(table){
        let dots = d3.select('#bump-dots').selectAll('circle');

        for(let gw = 0; gw < 38; gw++){
            let games = table[gw];
            
            dots.data(games)
                .enter()
                .append('circle')
                .attr('r', 6)
                .attr('class', d => d.team_abbr.toLowerCase());
        }
        this.updatePosition(d3.select('#bump-dots').selectAll('circle'), 'place')
    }

    drawAxes(key){ 
        let vShift = this.size.height - this.size.padding.bottom + 15
        let lines = new Array(38)
        for(let i = 1; i <= 38; i++){lines[i-1] = i}
        let xAxis = d3.select('#bump-x-axis')
        xAxis.attr('transform', `translate(0,${vShift})`)

        xAxis.selectAll('line')
            .data(lines)
            .join('line')
            .attr('x1', d => this.xScale(d))
            .attr('x2', d => this.xScale(d))
            .attr('y1', 40)
            .attr('y2', 65)
            .classed('axis-line', true)
        
        xAxis.selectAll('text')
            .data(lines)
            .join('text')
            .attr('x', d => this.xScale(d))
            .attr('y', 80)
            .text(d => d)
            .classed('small-axis', true)

        xAxis
            .append('text')
            .attr('x', this.xScale(1))
            .attr('y', 20)
            .text("Select a region by brushing the bars below")
            .attr('fill', "grey")
            .attr('id', 'instr-text')
        
        this.svg.append('text')
            .text('Gameweek')
            .attr('x', - vShift - 45)
            .attr('y', 20)
            .attr('transform', 'rotate(-90)')
            .classed('axis-text', true)

        let yScale = d3.scaleLinear().domain((key == 'place') ? [1, 20] : [1, 0]).range([this.size.padding.top, this.size.height - this.size.padding.bottom]);
        
        let yAxis = d3.select('#bump-y-axis')
        yAxis.attr('transform', `translate(${this.size.padding.left - 15},0)`)
        yAxis
            .transition()
            .duration(200)
            .call(d3.axisLeft(yScale))
        d3.select('#y-axis-text')
            .text( (key == "place") ? "Place" : "Percent of Max Possible Points" )
        
    }

    zoomAxes(selection){
        let masterScale = this.xScale
        let vShift = this.size.height - this.size.padding.bottom + 15
        let lines = new Array()
        for(let i = Math.ceil(selection[0]); i <= Math.floor(selection[1]); i++){lines.push(i)}
        let xAxis = d3.select('#bump-x-axis')

        xAxis.selectAll('line.zoom-axis')
            .data(lines)
            .join('line')
            .attr('x1', d => masterScale(d))
            .attr('x2', d => masterScale(d))
            .attr('y1', 40)
            .attr('y2', 65)
            .classed('zoom-axis', true)

        xAxis.selectAll('text.zoom-axis')
            .data(lines)
            .join('text')
            .attr('x', d => masterScale(d))
            .attr('y', 80)
            .text(d => d)
            .classed('zoom-axis', true)
        
        let newScale = d3.scaleLinear().domain([Math.ceil(selection[0]), Math.floor(selection[1])]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
        this.xScale = newScale

        xAxis.selectAll('line.zoom-axis')
            .transition()
            .duration(500)
            .attr('y1', 0)
            .attr('y2', 25)
            .attr('x1', d => newScale(d))
            .attr('x2', d => newScale(d))

        xAxis.selectAll('text.zoom-axis')
            .transition()
            .duration(500)
            .attr('x', d => newScale(d))
            .attr('y', 35)
            .text(d => d)

        d3.select('#instr-text')
            .transition()
            .duration(500)
            .style('opacity', 0)
    }

    clearZoom() {
        d3.selectAll('.zoom-axis').remove();
        this.clearTeams()
        this.xScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
        this.updatePosition(d3.select('#bump-lines').selectAll('line'), document.getElementById('y-axis-select').value, this.xScale);
        this.updatePosition(d3.select('#bump-dots').selectAll('circle'), document.getElementById('y-axis-select').value, this.xScale);

        d3.select('#instr-text')
            .transition()
            .duration(500)
            .style('opacity', 1)
    }

    makeBrush(){
        let vShift = this.size.height - this.size.padding.bottom + 15 + 40

        let rad = 2.5;
        this.brush = d3.brushX()
            .extent([[this.size.padding.left - 5, vShift - rad], [this.size.width - this.size.padding.right + 5, vShift + 25 + rad]])
            .on('brush', d => { 
                if(d.selection){
                    this.clearTeams()
                    let gwFilter = d.selection.map(x => this.xScale.invert(x))
                    console.log(gwFilter) // use this to select and stuff, returns array of selection bounds in terms of gameweek
                    
                    d3.selectAll('#bump-dots circle').filter(d => d.gw < gwFilter[0] | d.gw > gwFilter[1]).classed('grayed', true);
                    d3.selectAll('#bump-lines line').filter(d => d.gw-1 < gwFilter[0] | d.gw > gwFilter[1]).classed('grayed', true);
                    d3.selectAll('.axis-line').filter(d => d < gwFilter[0] | d > gwFilter[1]).classed('grayed', true);
                    d3.selectAll('.small-axis').filter(d => d < gwFilter[0] | d > gwFilter[1]).classed('grayed', true);
                }
            })
            .on('end', d => { 
                if(d.selection){ 
                    let gwFilter = d.selection.map(x => this.xScale.invert(x))
                    this.zoomAxes(gwFilter)

                    //TODO: Update Places based on selection

                    // this.xScale = d3.scaleLinear().domain([Math.ceil(gwFilter[0]), Math.floor(gwFilter[1])]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
                    this.updatePosition(d3.select('#bump-lines').selectAll('line'), document.getElementById('y-axis-select').value);
                    this.updatePosition(d3.select('#bump-dots').selectAll('circle'), document.getElementById('y-axis-select').value); 
                } else {
                    this.clearZoom();
                }     
            } )

        d3.select('#brush-wrapper')
            .call(this.brush)
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
