# Process book

Premier League Season Explorer


## Overview and Motivation

It’s easy to tell who wins the Premier League at the end of the year, but how did they get there? What were the challenging games that could have broken their championship season? What were their best games? 

What about the other teams, who won the alternative tables? If you look at just the Christmas games, the first half of the season, the post-lockdown games, who would have come out on top?

Finally, 2019/2020 was a big year for manager changes. We’ll show the “eras” of the managers and answer questions about whether it was necessary to sack them in the first place. How did the new guy compare?

We all have an interest in soccer, while Jakob and Brian religiously follow the Premier League. Thus, we decided to choose this project as playing to our interests. All of us love looking for trends in data, with a particular interest in sports data.


## Related Work

There are many sites that can be used to visualize individual Premier League games (e.g. *The Guardian* and the official Premier League site). There are also sites that can be used to visualize an entire season (again, the official Premier League site can do this). But there are not many sites out there that make it easy to visualize part of a season, or easily switch between game data and season data.


## Questions

Interactively visualize a single English Premier League (EPL) season with a game-by-game breakdown for all teams in the EPL.

Show how each team performed versus other teams, and as a function of time over the entire season. Allow the user to zoom in on individual games and see the significant events during each game, such as who scored or who was shown a red card.

Tell stories about the season in by-team view. For example, show when a manager was sacked and compare performance on either side of this event, or see when a team played a champions league match and whether it seemed to affect their performance in league matches.

Aside from our objectives in creating a suitable visualization for the data, we would like to utilize this time to learn more JavaScript/D3/programming techniques that we will utilize in our chosen career paths post-graduation. We would like to learn how to create an effective visualization and wrangle data into appropriate forms from scratch, using our creativity and knowledge without relying on visualization templates or other such interventions from people knowledgeable on the subject. Additionally, we would like to gain experience working as a team while coding: a skill that is not often taught in classes and that we can take unique advantage of during this project.


## Data

Use CSVs from FootyStats https://footystats.org/england/premier-league#. This is a website with a huge amount of data that can be downloaded. Although we do need to pay for it, it’s only 20 euros per month and we only need it for one month so we all agreed to chip in ⅓ of the cost for the benefit of the project.

Premier league website https://premierleague.com. This will be useful for any data that for some reason isn’t on the footystats site. As far as we’re aware, however, there is no data dump download option, so we will use this as little as possible to minimize unnecessary work of manual data transcription.


## Exploratory Data Analysis

Thus far, the season data downloaded from FootyStats has worked well for implementing the bump chart, season summary chart, and game table. The only data we needed to add to the csv file to make this work was game week, which was almost trivial to implement. There was also no column for cumulative points on the season, but it was easy to implement a function in JavaScript to calculate this number of points for the season summary chart. The function will later be extended to allow for only games during certain game weeks to count towards the total, and based on the function design this should be trivial as well once we reach that point. Similarly, there was no column for margin of victory (used for saturation/hue in the game table), but this was easy to calculate from the home team and away team goals.

One wrinkle we came across midway through the project is that the footystats data does not include anything about individual players (e.g. who cards, subs, goals broken down by player). Thus, we were forced to manually grab player data from the Premier League website game by game. As a result, we will limit our individual game detail view to only include game-changing events (goals and red cards), as any more than this (in particular full lineups and substitutions) would require an inordinate amount of work to input the data.


## Design Evolution

So far, we are sticking mostly to our original designs, apart from the game detail view for the reasons mentioned above. The season summary chart is still a horizontal bar chart with team encoded by both vertical position and hue, and the game table is still an adjacency matrix with a diverging color scale for margin of victory. The bump chart is still 20 superimposed line charts, with team encoded by hue of the dots.

We did, however, make some major changes to the game detail view. The most notable of these is that we decided to juxtapose rather than superimpose the game detail view. When designing the page there was extra unused space in the bottom right, and juxtapoxing the game detail view to this space rather than superimposing it saves the user the effort of first having to close the superimposed view before selecting a new game to view. As mentioned above, we were also unable to provide full lineups, substitutions, or yellow cards to present in the game detail view due to the lack of a database for such information; it instead lists only goals and red cards (i.e. game-changing events).

We also made some more minor aesthetic changes to the other views. We originally colored the bump chart lines by secondary team color, but this made some teams stand out in the chart much more than others. Thus, we instead changed the line color to be a uniform gray for all teams, eliminating this effect. We also originally used a pure diverging color scale for the game table margin of victory, but found that it was difficult to determine the hue of the games with a margin of 1 point due to the colors being so desaturated. We instead continued to use white as the color for a draw, but increased the saturation of all subsequent victory margins (i.e. there is a jump in saturation greater than expected foro a pure diverigng color scale between a draw and a 1-point margin of victory).

With regards to interactivity, we have mostly maintianed our original plans of being able to show the game detail of a single game at a time, highlight teams across all three primary views, and select a certain time range of games to show. However, we also enabled the ability to highlight multiple teams at once rather than just one; this allows for easier visualization of, for example, the relegation battle or race for Champions League spots. We also realized that we had two competing uses for clicking on the bump chart: opening the corresponding game in the game detail view and highlighting the team across all views. We thus decided that highlighting teams should only be accomplished by clicking on the season summary chart.


## Implementation

JavaScript and D3 have suited our needs well. We did not run into any major road blocks or other significant problems during the process. Coding-wise, we kept our main script.js file reserved only for code that either loads in the data to be visualized or is responsible for linking between the different views. We placed all other JavaScript code in the individual JavaScript files pertaining to each view.


## Evaluation
