/** Class implementing the game detail view. */
class GameDetail {

    constructor(data, updateGame) {
        this.data = data;
        this.updateGame = updateGame;
        this.drawDiv();
    }

    drawDiv() {

        let firstHalfScale = d3.scaleLinear().domain([0, 45]).range([10, 470]);
        let secondHalfScale = d3.scaleLinear().domain([45, 90]).range([10, 470]);

        d3.select("#game-detail").append("p").classed("game-header", true);
        d3.select("#game-detail").append("p").classed("game-stats", true);
        let svgGroup = d3.select("#game-detail").append("svg").classed("detail-svg",true).style("display", "none");
        svgGroup.append("g").attr("id", "firstHalfAxis").attr("transform", "translate(0, 50)").classed("axis", true).call(d3.axisBottom().scale(firstHalfScale));
        svgGroup.append("text").attr("transform", "translate(220, 90)").text("First half").classed("half-text", true);
        svgGroup.append("g").attr("id", "secondHalfAxis").attr("transform", "translate(0, 150)").classed("axis", true).call(d3.axisBottom().scale(secondHalfScale));
        svgGroup.append("text").attr("transform", "translate(213, 190)").text("Second half").classed("half-text", true);
    }

    showGame(gameID) {
        d3.select(".detail-svg").style("display", "block");
        let matchData = this.data.find(d => d.game_id === gameID);
        let svgGroup = d3.select(".detail-svg")
        let firstHalfScale = d3.scaleLinear().domain([0, 45]).range([10, 470]);
        let secondHalfScale = d3.scaleLinear().domain([45, 90]).range([10, 470]);

        let [goals, reds] = this.getGameEvents(matchData);

        d3.select(".game-header").text(matchData.home_team_name + " " + matchData.home_team_goal_count + "\u2013" + matchData.away_team_goal_count + " " + matchData.away_team_name);
        d3.select(".game-stats").text("Week " + matchData.gameweek + " \u2014 " + "Attendance: " + matchData.attendance);

        let circles = svgGroup.selectAll("circle").data(goals).join("circle").attr("class", d => "goal " + (d.team === "home" ? window.teamData.find(e => e.name_long === matchData.home_team_name).name_abbr.toLowerCase() : window.teamData.find(e => e.name_long === matchData.away_team_name).name_abbr.toLowerCase())).attr("r", 7);
        circles.attr("cx", d => d.half === 1 ? firstHalfScale(d.minute.substring(0, 2)) : secondHalfScale(d.minute.substring(0, 2))).attr("cy", d => d.half === 1 ? 35 : 135);
        circles.on("mouseover", (event, d) => d3.select("#game-detail").append("p").classed("event-text", true).text((d.team === "home" ? window.teamData.find(e => e.name_long === matchData.home_team_name).name_short : window.teamData.find(e => e.name_long === matchData.away_team_name).name_short) + " goal! " + d.minute + (d.minute.substring(2,3) === "'" ? " " : "' ") + d.player));
        circles.on("mouseout", (event, d) => d3.selectAll(".event-text").remove());

        let rects = svgGroup.selectAll("rect").data(reds).join("rect").attr("class", d => "card " + (d.team === "home" ? window.teamData.find(e => e.name_long === matchData.home_team_name).name_abbr.toLowerCase() : window.teamData.find(e => e.name_long === matchData.away_team_name).name_abbr.toLowerCase())).attr("width", 10).attr("height", 14);
        rects.attr("x", d => d.half === 1 ? firstHalfScale(d.minute.substring(0, 2)) : secondHalfScale(d.minute.substring(0, 2))).attr("y", d => d.half === 1 ? 28 : 128);
        rects.on("mouseover", (event, d) => d3.select("#game-detail").append("p").classed("event-text", true).text((d.team === "home" ? window.teamData.find(e => e.name_long === matchData.home_team_name).name_short : window.teamData.find(e => e.name_long === matchData.away_team_name).name_short) + " red card! " + d.minute + (d.minute.substring(2,3) === "'" ? " " : "' ") + d.player));
        rects.on("mouseout", (event, d) => d3.selectAll(".event-text").remove());

    }

    clearGame() {
        d3.selectAll(".card").remove();
        d3.selectAll(".goal").remove();
        d3.select(".game-header").text("");
        d3.select(".game-stats").text("");
        d3.select(".detail-svg").style("display", "none");
    }

    getGameEvents(matchData) {

        let goals = [];
        let reds = [];

        let calcHalf = function(minute) {
            let half = 0;
            minute.substring(0, 2) < 46 ? half = 1 : half = 2;
            return half;
        }

        for (let i = 0; i < matchData.home_team_goal_timings.split(",").length; i++) {
            if (matchData.home_team_goal_timings !== "") {
                goals.push({team: "home", half: calcHalf(matchData.home_team_goal_timings.split(",")[i]), minute: matchData.home_team_goal_timings.split(",")[i], player: matchData.home_goal_scorers.split(",")[i]});
            }
        }
        for (let i = 0; i < matchData.away_team_goal_timings.split(",").length; i++) {
            if (matchData.away_team_goal_timings !== "") {
                goals.push({team: "away", half: calcHalf(matchData.away_team_goal_timings.split(",")[i]), minute: matchData.away_team_goal_timings.split(",")[i], player: matchData.away_goal_scorers.split(",")[i]});
            }
        }
        for (let i = 0; i < matchData.home_red_card_minutes.split(",").length; i++) {
            if (matchData.home_red_card_minutes !== "") {
                reds.push({team: "home", half: calcHalf(matchData.home_red_card_minutes.split(",")[i]), minute: matchData.home_red_card_minutes.split(",")[i], player: matchData.home_red_cards.split(",")[i]});
            }
        }
        for (let i = 0; i < matchData.away_red_card_minutes.split(",").length; i++) {
            if (matchData.away_red_card_minutes !== "") {
                reds.push({team: "away", half: calcHalf(matchData.away_red_card_minutes.split(",")[i]), minute: matchData.away_red_card_minutes.split(",")[i], player: matchData.away_red_cards.split(",")[i]});
            }
        }

        return [goals, reds];
    }

}
