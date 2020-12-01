function textBox(){
    let headBlurb = `At the beginning of the season,`
    let textBlurb = ` 
    each team comes with different levels of expectations. See how this team's season unfolded based on some key events. 
    `
    let textDiv = d3.select('#storytelling-text')
    .append('div');
    textDiv.style('opacity', 0)
    .classed('text-blurb', true)
    .transition()
    .delay(700).style('opacity', 1);

    textDiv.append('span').append('text')
    .attr('opacity', 0)
    .text(headBlurb);
    textDiv.append('text').text(textBlurb);
}

function drawStorytellingDropdown() {
    var storytellingGroup = ["None", "Tottenham Hotspur", "Arsenal"]
    // add the options to the button
    d3.select("#storytelling-select")
        .selectAll('myOptions')
        .data(storytellingGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button

}