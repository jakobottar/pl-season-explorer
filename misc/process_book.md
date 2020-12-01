l# Process book

Premier League Season Explorer


## Overview and Motivation

It’s easy to tell who wins the Premier League at the end of the year, but how did they get there? What were the challenging games that could have broken their championship season? What were their best games? 

What about the other teams, who won the alternative tables? If you look at just the Christmas games, the first half of the season, the post-lockdown games, who would have come out on top?

Finally, 2019/2020 was a big year for manager changes. We’ll show the “eras” of the managers and answer questions about whether it was necessary to sack them in the first place. How did the new guy compare?

We all have an interest in soccer, while Jakob and Brian religiously follow the Premier League. Thus, we decided to choose this project as playing to our interests. All of us love looking for trends in data, with a particular interest in sports data.


## Related Work

There are many sites that can be used to visualize individual Premier League games (e.g. *The Guardian* and the official Premier League site). There are also sites that can be used to visualize an entire season (again, the official Premier League site can do this). But there are not many sites out there that make it easy to visualize part of a season, or easily switch between game data and season data.


## Questions and Goals

Main goal: Interactively visualize a single English Premier League (EPL) season with a game-by-game breakdown for all teams in the EPL.

Show how each team performed versus other teams, and as a function of time over the entire season. Allow the user to zoom in on individual games and see the significant events during each game, such as who scored or who was shown a red card.

Tell stories about the season in by-team view. For example, show when a manager was sacked and compare performance on either side of this event, or see when a team played a champions league match and whether it seemed to affect their performance in league matches.

Aside from our objectives in creating a suitable visualization for the data, we would like to utilize this time to learn more JavaScript/D3/programming techniques that we will utilize in our chosen career paths post-graduation. We would like to learn how to create an effective visualization and wrangle data into appropriate forms from scratch, using our creativity and knowledge without relying on visualization templates or other such interventions from people knowledgeable on the subject. Additionally, we would like to gain experience working as a team while coding: a skill that is not often taught in classes and that we can take unique advantage of during this project.


## Data

Use CSVs from FootyStats https://footystats.org/england/premier-league#. This is a website with a huge amount of data that can be downloaded. Although we do need to pay for it, it’s only 20 euros per month and we only need it for one month so we all agreed to chip in ⅓ of the cost for the benefit of the project.

Premier league website https://premierleague.com. This will be useful for any data that for some reason isn’t on the footystats site. As far as we’re aware, however, there is no data dump download option, so we will use this as little as possible to minimize unnecessary work of manual data transcription.


## Exploratory Data Analysis

Thus far, the season data downloaded from FootyStats has worked well for implementing the bump chart, season summary chart, and game table. The only data we needed to add to the csv file to make this work was game week, which was almost trivial to implement. There was also no column for cumulative points on the season, but it was easy to implement a function in JavaScript to calculate this number of points for the season summary chart. Similarly, there was no column for margin of victory (used for saturation/hue in the game table), but this was easy to calculate on the fly in the visualiztaion. from the home team and away team goals.

One wrinkle we came across midway through the project is that the footystats data does not include anything about individual players (e.g. who cards, subs, goals broken down by player). Thus, we were forced to manually grab player data from the Premier League website game by game. As a result, we will limit our individual game detail view to only include game-changing events (goals and red cards), as any more than this (in particular full lineups and substitutions) would require an inordinate amount of work to input the data.


## Design Evolution

So far, we are sticking mostly to our original designs, apart from the game detail view for the reasons mentioned above. The season summary chart is still a horizontal bar chart with team encoded by both vertical position and hue, and the game table is still an adjacency matrix with a diverging color scale for margin of victory. The bump chart is still 20 superimposed line charts, with team encoded by hue of the dots.

We did, however, make some major changes to the game detail view. The most notable of these is that we decided to juxtapose rather than superimpose the game detail view. When designing the page there was extra unused space in the bottom right, and juxtapoxing the game detail view to this space rather than superimposing it saves the user the effort of first having to close the superimposed view before selecting a new game to view. As mentioned above, we were also unable to provide full lineups, substitutions, or yellow cards to present in the game detail view due to the lack of a database for such information; it instead lists only goals and red cards (i.e. game-changing events).

We also made some more minor aesthetic changes to the other views. We originally colored the bump chart lines by secondary team color, but this made some teams stand out in the chart much more than others. Thus, we instead changed the line color to be a uniform gray for all teams, eliminating this effect. We also originally used a pure diverging color scale for the game table margin of victory, but found that it was difficult to determine the hue of the games with a margin of 1 point due to the colors being so desaturated. We instead continued to use white as the color for a draw, but increased the saturation of all subsequent victory margins (i.e. there is a jump in saturation greater than expected foro a pure diverigng color scale between a draw and a 1-point margin of victory).

With regards to interactivity, we have mostly maintianed our original plans of being able to show the game detail of a single game at a time, highlight teams across all three primary views, and select a certain time range of games to show. However, we also enabled the ability to highlight multiple teams at once rather than just one; this allows for easier visualization of, for example, the relegation battle or race for Champions League spots, or allowing a user to higlight their favorite teams if they have multiple. We also realized that we had two competing uses for clicking on the bump chart: opening the corresponding game in the game detail view and highlighting the team across all views. We thus decided that highlighting teams should only be accomplished by clicking on the season summary chart.

We were originally going to also include the Champions League and relegation places in the bump chart by adding horizontal lines between 17th and 18th (for relegation), and between 4th and 5th (for Champions League). However, we decided that the bump chart was already too cluttered, and that adding these features would make it harder to decipher the primary purpose of the chart, which is to show how the teams did over the course of an entire season. Readers interested in this info already have it implicitely in the season summary chart immediately to the right even when the brush is activated, as the top four finishers automatically advance to the champions league and the bottom three are relegated.

One final minor problem that we ran into is the possibility that the user could brush over a small enough range of games that a team could pick up zero points. While this is mostly fine, it posed a problem for our team selection method, as the bar to click on to select the team would have zero length. To remedy this, we also allowed for clicking on the team names in the points total chart.

In the end, we have settled on the following design:

**INSERT IMAGES HERE**

The justification for our choices of desing is as follows:
- Bump chart:
  - Juxtapoxed line charts used, since the data is tabluar and the number of teams is small enough (20) that juxtaposed line charts are appropriaet (20 is on the upper end of the range, but we see it as still acceptable since due to the nature of the bump chart the number of line crossings is minimal and we are using two hues for each team).
  - X-axis position (position on single scale) chosen to represent game week since it's the independent variable and is the most important attribute
  - Y-axis position (position on single scale) chosen to represent position/points/GD since they're the dependent variables and are the most important dependent attributes. All choices carry similar but distinct information with noting to be gained from viewing the different variables at the same time, so a menu to switch the displayed y-axis was used.
  - Two hues (a primary and secondary) chosen to represent team, since hue is the next dominant channel after position, but 20 is too many hues for a single encoding to be able to capture. However, by using both primary and secondary team colors, we are able to encode all 20 teams with distinguishable hues representing the team colors.
- Points total:
  - Bar chart used, since there is a single cate
  - Y-axis position chosen to represent team, since it's the dominant sensory input for categorical variables. A redundant encoding of hue is used as well, to match the hues used in the bump chart in order to allow for easier cross-referencing.
  - Length of bars (and hence also position on x-axis since they all start from the same x-value) chosen to represent total points, since it's a quantitative attribute and is the most dominant encoding.
- Game table:
  - Adjacency matrix network visualization used for this complete graph network because the attributes of the links (i.e. games) are the important parts, not anything to do with the nodes or the "distance between nodes".
  - Spatial region chosen to encode which teams are playing, since it's the most important attribute of this categorical data
  - Saturation/hue on a diverging scale chosen to show margin of victory, since it's ordinal data and the position attribute is already taken, and luminance would make it harder to read the text inside.
- Game detail:
  - This is a custom visualization that does not correspond to something like a bar chart or a line chart, since the data is not easily fit by one of these common visualization types.
  - Position is used for the times in the game of goals and red cards, since it's the dominant encoding
  - Hue is used for the team scoring the goal or receiving the red card, since it's a categorical attribute and hue is the next dominant channel after position, and also for consistency with other views.

## Implementation

JavaScript and D3 have suited our needs well. We did not run into any major road blocks or other significant problems during the process. Coding-wise, we kept our main script.js file reserved only for code that either loads in the data to be visualized or is responsible for linking between the different views. We placed all other JavaScript code in the individual JavaScript files pertaining to each view.


## Evaluation
