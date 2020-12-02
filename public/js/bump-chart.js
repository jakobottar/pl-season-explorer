/** Class implementing the bump chart. */
class BumpChart {

    constructor(updateGame, updateTeam, updateWeeks) {
        this.data;
        this.updateGame = updateGame;
        this.updateTeam = updateTeam;
        this.updateWeeks = updateWeeks;

        this.svg;
        this.size;

        this.table;
        this.brush;
        this.xScale;

        this.isZoomed = false;
    }

    setData(data) { this.data = data; }

    drawChart() {
        
        drawStorytellingDropdown()
        this.table = this.makeTable();
        let tooltip = d3.select('#bump-chart').append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);

        this.size = d3.select('#bump-chart').node().getBoundingClientRect();
        this.size.padding = {'top': 20, 'bottom': 100, 'left': 60, 'right': 20};
        this.svg = d3.select('#bump-chart').append('svg');

        this.xScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right])
        
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

        let yAxis = d3.select('#bump-y-axis')
        yAxis.attr('transform', `translate(${this.size.padding.left - 15},0)`)
        // covering rectangle to hide dots/lines behind y axis
        yAxis
            .append('rect')
            .attr('x', -(this.size.padding.left-15))
            .attr('y', this.size.padding.top - 7)
            .attr('width', this.size.padding.left-15)
            .attr('height', this.size.height - this.size.padding.bottom)
            .style('fill', 'white')

        this.drawXAxis();
        this.drawYAxis('place');

        this.highlightStory();

        let circles = d3.select('#bump-dots').selectAll('circle');

        circles.on('mouseover', (event, d) => {
            tooltip.text('');
            tooltip.style('display', 'block').transition().duration(200).style('opacity', 0.9);
            tooltip.style('left', (event.pageX + 5 - 10) + 'px').style('top', (event.pageY - 28 - 200) + 'px');
            tooltip.append('span').classed('tooltip-text', true).text(d.team_name);
            tooltip.append('br');
            tooltip.append('span').classed('tooltip-text', true).text('Points: ' + d.points);
            tooltip.append('br');
            tooltip.append('span').classed('tooltip-text', true).text('Place: ' + d.place);
            tooltip.append('br');
            tooltip.append('span').classed('tooltip-text', true).text('GD: ' + d.gd);
        });
        circles.on('mouseout', () => {
            tooltip.transition().duration(500).on('end', () => tooltip.style('display', 'none')).style('opacity', 0);
        });
        circles.on('click', (event, d) => {
            console.log(d);
            this.updateGame(d.game_id);
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
                    home.prev_points = home.points;
                    home.points += getPoints(e.home_team_goal_count, e.away_team_goal_count);
                    home.prev_gd = home.gd;
                    home.gd += e.home_team_goal_count - e.away_team_goal_count;
                    home.gs += +e.home_team_goal_count;
                    home.prev_p_of_max_points = home.p_of_max_points;
                    home.p_of_max_points = home.points / ((i+1)*3);
                    home.game_id = e.game_id;
                    home.prev_place = home.place;
                    home.gw = i+1;
                    col.push(home);

                    let away = Object.assign({}, table[i-1].find(d => d.team_name == e.away_team_name));
                    away.prev_points = away.points;
                    away.points += getPoints(e.away_team_goal_count, e.home_team_goal_count);
                    away.prev_gd = away.gd;
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

        this.drawYAxis(key)
        this.updatePosition(d3.select('#bump-lines').selectAll('line'), key);
        this.updatePosition(d3.select('#bump-dots').selectAll('circle'), key);
    }

    updatePosition(elements, key){
        function myRange(table, key){
            let max = table[0][0][key];
            let min = table[0][0][key];
            for(let i = 0; i < table.length; i++){
                for(let j = 0; j < table[i].length; j++){
                    if(max < table[i][j][key]){ max = table[i][j][key]; }
                    if(min > table[i][j][key]){ min = table[i][j][key]; }
                }
            }

            if(key == 'place') {return [min, max];}
            return [max, min];
        }

        let range = myRange(this.table, key)
        let yScale = d3.scaleLinear()
            .domain(range)
            .range([this.size.padding.top, this.size.height - this.size.padding.bottom]);

        if (elements._groups[0][0].nodeName == 'line') {
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

    drawXAxis() {
        let vShift = this.size.height - this.size.padding.bottom + 15
        let masterScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
        let lines = new Array(38)
        for(let i = 1; i <= 38; i++){lines[i-1] = i}
        let xAxis = d3.select('#bump-x-axis')
        xAxis.attr('transform', `translate(0,${vShift})`)

        xAxis.selectAll('line')
            .data(lines)
            .join('line')
            .attr('x1', d => masterScale(d))
            .attr('x2', d => masterScale(d))
            .attr('y1', 40)
            .attr('y2', 65)
            .classed('axis-line', true)
        
        xAxis.selectAll('text')
            .data(lines)
            .join('text')
            .attr('x', d => masterScale(d))
            .attr('y', 80)
            .text(d => d)
            .classed('small-axis-text', true)
        
        xAxis
            .append('circle')
            .attr('cx', masterScale(29.5))
            .attr('cy', 52.5)
            .attr('r', 4)
            .style('fill', 'red')
            .style('stroke', 'darkred')

        xAxis
            .append('text')
            .attr('x', masterScale(29.5))
            .attr('y', 32.5)
            .attr('class', 'instr-text')
            .text('Lockdown')
            .classed('small-axis-text', true)
            .style('fill', 'red')

        xAxis
            .append('text')
            .attr('x', masterScale(1))
            .attr('y', 20)
            .text('Select a region by brushing the bars below')
            .style('fill', 'grey')
            .attr('class', 'instr-text')
        
        this.svg.append('text')
            .text('Gameweek')
            .attr('x', - vShift - 45)
            .attr('y', 20)
            .attr('transform', 'rotate(-90)')
            .classed('axis-text', true)
    }

    drawYAxis(key){
        function myRange(table, key){
            let max = table[0][0][key];
            let min = table[0][0][key];
            for(let i = 0; i < table.length; i++){
                for(let j = 0; j < table[i].length; j++){
                    if(max < table[i][j][key]){ max = table[i][j][key]; }
                    if(min > table[i][j][key]){ min = table[i][j][key]; }
                }
            }

            if(key == 'place') {return [min, max];}
            return [max, min];
        }

        let range = myRange(this.table, key)
        let yScale = d3.scaleLinear().domain(range).range([this.size.padding.top, this.size.height - this.size.padding.bottom]);
        
        let yAxis = d3.select('#bump-y-axis')
        yAxis
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale))
        d3.select('#y-axis-text')
            .text( _ => {
               let e = document.getElementById('y-axis-select')
               return e.options[e.selectedIndex].text 
            });
    }

    zoomAxes(selection){
        function inRange(x, range){
            range.sort((a,b) => a-b);
            return(x > range[0] & x < range[range.length - 1]);
        }
        
        let masterScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right])
        let vShift = this.size.height - this.size.padding.bottom + 15
        let lines = new Array()
        for(let i = 1; i <= 38; i++){lines.push(i)}
        let xAxis = d3.select('#bump-x-axis')

        let newScale = d3.scaleLinear().domain([selection[0], selection[1]]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
        
        d3.selectAll('.zoom-axis').style('opacity', 1)

        if(!this.isZoomed){
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

            d3.selectAll('.zoom-axis').filter(d => !inRange(d, selection)).style('opacity', 0)
        } 
        
        this.xScale = newScale
        this.isZoomed = true;

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

        d3.selectAll('.instr-text')
            .transition()
            .duration(500)
            .style('opacity', 0)

        d3.selectAll('.zoom-axis')
            .filter(d => !inRange(d, [selection[0] - 1, selection[1] + 1]))
            .transition()
            .delay(500)
            .style('opacity', 0)
    }

    clearZoom() {
        this.isZoomed = false;
        d3.selectAll('.axis-line').classed('grayed', false)
        d3.selectAll('.small-axis-text').classed('grayed', false)

        this.xScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right]);
        this.updatePosition(d3.select('#bump-lines').selectAll('line'), document.getElementById('y-axis-select').value);
        this.updatePosition(d3.select('#bump-dots').selectAll('circle'), document.getElementById('y-axis-select').value);

        let xAxis = d3.select('#bump-x-axis')

        xAxis.selectAll('line.zoom-axis')
            .transition()
            .duration(500)
            .attr('x1', d => this.xScale(d))
            .attr('x2', d => this.xScale(d))
            .attr('y1', 40)
            .attr('y2', 65)

        xAxis.selectAll('text.zoom-axis')
            .transition()
            .duration(500)
            .attr('x', d => this.xScale(d))
            .attr('y', 80)
            .text(d => d)

        d3.selectAll('.zoom-axis')
            .transition()
            .delay(500)
            .remove()

        d3.selectAll('.instr-text')
            .transition()
            .duration(500)
            .style('opacity', 1)
    }

    makeBrush(){
        let vShift = this.size.height - this.size.padding.bottom + 15 + 40
        let masterScale = d3.scaleLinear().domain([1, 38]).range([this.size.padding.left, this.size.width - this.size.padding.right])

        function inRange(x, range){
            range.sort((a,b) => a-b);
            return(x > range[0] & x < range[range.length - 1]);
        }

        let rad = 2.5;
        this.brush = d3.brushX()
            .extent([[this.size.padding.left - 5, vShift - rad], [this.size.width - this.size.padding.right + 5, vShift + 25 + rad]])
            .on('brush', d => { 
                if(d.selection){
                    d3.selectAll('.axis-line').classed('grayed', false)
                    d3.selectAll('.small-axis-text').classed('grayed', false)
                    let gwFilter = d.selection.map(x => masterScale.invert(x))
                    inRange(1, gwFilter)
                    d3.selectAll('.axis-line').filter(d => !inRange(d, gwFilter)).classed('grayed', true);
                    d3.selectAll('.small-axis-text').filter(d => !inRange(d, gwFilter)).classed('grayed', true);
                }
            })
            .on('end', d => { 
                if(d.selection){ 
                    let gwFilter = d.selection.map(x => masterScale.invert(x))
                    this.zoomAxes(gwFilter)

                    console.log(gwFilter)

                    //TODO: Update Places based on selection
                    this.updateWeeks(gwFilter);

                    this.updatePosition(d3.select('#bump-lines').selectAll('line'), document.getElementById('y-axis-select').value);
                    this.updatePosition(d3.select('#bump-dots').selectAll('circle'), document.getElementById('y-axis-select').value); 
                } else {
                    this.clearZoom();
                    this.updateWeeks([0, 38])
                }     
            } );

        d3.select('#brush-wrapper')
            .call(this.brush);
    }

    selectGame(gameID){
        this.clearGames();

        d3.selectAll('#bump-dots circle')
            .filter((d) => gameID === d.game_id)
            .classed('selected', true);
    }

    clearGames(){
        d3.selectAll('#bump-dots circle')
            .classed('selected', false);
    }

    selectTeam(teamIDs) {
        this.clearTeams();
        d3.selectAll('#bump-dots circle').classed('grayed', true);
        d3.selectAll('#bump-lines line').classed('grayed', true);
        // Select the teams present in the array teamIDs
        d3.selectAll('#bump-dots circle').filter((d) => teamIDs.includes(d.team_abbr)).classed('filtered', true);
        d3.selectAll('#bump-lines line').filter((d) => teamIDs.includes(d.team_abbr)).classed('filtered', true);
      
        // Called when at a team is selected, and when a team is deselected and there are still other selected teams
	}

	clearTeams() {
        // Deselect all teams. Called when all teams are deselected, and from selectTeam
        d3.select('#bump-chart').selectAll('.filtered').classed('filtered', false); 
        d3.selectAll('#bump-dots circle').classed('grayed', false);
        d3.selectAll('#bump-lines line').classed('grayed', false);
    }
    
    clearGray() {
        d3.select('#bump-chart').selectAll('.grayed').classed('grayed', false);
    }
    highlightStory() {
        d3.select("#storytelling-select").on("change", e => {
            var selectedOption = document.getElementById('storytelling-select').value;
            if (selectedOption === "None") {
                this.clearTeams();
            }
            else {
        let datasets = [
            {
            "team_abbr": "TOT",
            "type": "Manager Sacking",
            "text": "Pochettino",
                "gw": 12,
                "fill": "green",
                "symbol": "cross",
        },
        {
            "team_abbr": "TOT",
            "type": "Manager Hiring",
            "text": "Mourinho",
            "gw": 12,
            "fill": "purple",
            "shape": "triangle-up"
        },
        {
            "team_abbr": "ARS",
            "type": "Manager Sacking",
            "text": "Emery",
            "gw": 15,
            "fill": "purple",
            "shape": "triangle-up"
        }
        ,
        {
            "team_abbr": "ARS",
            "type": "Manager Hiring",
            "text": "Arteta",
            "gw": 15,
            "fill": "purple",
            "shape": "triangle-up"
            }
        ]
        // this.svg = d3.select('#brush-wrapper');
                var circles = d3.selectAll('svg').append('svg')
              .append('g').attr('class', 'circles').data( datasets );
        circles.enter()
            .append("svg:circle")
            .text(d => (d.text))
            .attr("r", 400)
            .style("opacity", 1)
            .style("fill", d => (d.fill))
            .attr("cx", d => 10)
            .attr("cy", 12);
                // recover the option that has been chosen
        this.updateTeam(selectedOption);

        d3.selectAll('#bump-dots circle').filter(d => d.team_abbr != selectedOption).classed('grayed', true);
        d3.selectAll('#bump-lines line').filter(d => d.team_abbr != selectedOption).classed('grayed', true);
        }


            
        return selectedOption
    })
}
}
