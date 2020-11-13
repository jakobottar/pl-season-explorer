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

So far, we are sticking mostly to our original designs, apart from the game detail view for the reasons mentioned above. The season summary chart is still a bar chart, and the game table is still an adjacency matrix with a diverging color scale for margin of victory.  The final aesthetics have yet to be finalized, but the major components and content is there in thee two views.

The bump chart is also progressing along well, and should be finished soon. After this is done, we will work on interactivity between the three charts and a draft of the game detail view (both hopefully done in a draft form by next Friday).

## Implementation

Thus far, JavaScript and D3 has suited our needs well. We have not run into any major road blocks, and our season summary chart and game summary table are (aside from interactivty and aesthetics) complete. The bump chart is well on its way as well, with the game detail view set to come next week.

## Evaluation
