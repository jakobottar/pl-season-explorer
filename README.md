# Premier League Season Explorer

A final project for [CS 6630 - Data Visualization Fall 2020](http://dataviscourse.net/2020/index.html)  
by [Brian Eisner](mailto:brian.eisner@utah.edu), [Jakob Johnson](mailto:jakob.ottar@pm.me), and [Kevin Wood](mailto:kevin.wood@utah.edu)

## Project Website and Screencast
- Website: [Premier League Season Explorer](http://pl-explorer.com/)
- Screencast: **INSERT SCREENCAST HERE**

## Background

It’s easy to tell who wins the Premier League at the end of the year, but how did they get there? What were the challenging games that could have broken their championship season? What were their best games? 

What about the other teams, who won the #alternativetables? If you look at just the Christmas games, the first half of the season, the post-lockdown games, who would have come out on top?

We all have an interest in soccer, while Jakob and Brian religiously follow the Premier League. Thus, we decided to choose this project as playing to our interests. All of us love looking for trends in data, with a particular interest in sports data.

## Instructions and Use

There are several components to using our visualization. The loaded page will show the entire season, and the bump chart's y-axis will be team position. There are multiple methods of interactivity
- Changing the bump chart y-axis scale: the bump chart can use team position, total points, percent of maximum possible points, or goal differential. Use the dropdown menu to change the displayed axis.
- Team selection: to highlight certain teams in all views, click on the team's bar in the points total view. Multiple teams can be highlighted this way. To deselect a team, click on the bar again; to deselect all teams, click on the whitespace between bars in the points total view.
- Game selection: to view a certain game in detail, click on the game in either the bump chart or the game table. This will bring up the game's detail view in the the lower right space. To deselect, either choose another game (selecting that game's detail in the process) or click the same game again.
- Partial season selection: to only view results and tables from a portion of the season, brush on the game week bar located below the bump chart. This will update all views to only show results from the selected game weeks.

## Code Documentation

All code is our own work: we did not import libraries from anywhere.
- about
  - index.html: contains the code for the "about" page.
- css
  - styles.css: contains all css styling code apart from team colors.
  - team-colors.css: contains team color stylings.
- data
  - seasonData.csv: contains data on all games during the entire 2019-20 Premier League season. Mostly from [FootyStats](https://footystats.org), with additional information added from the [Premier League website](https://premierleague.com).
  - teamInfo.csv: contains reference data on each team (e.g. long name, abbreviation).
- img/favicons
  - apple-touch-icon.png: icon for Apple mobile product landing screens.
  - favicon-16x16.png: low-resolution favicon.
  - favicon-32x32.png: high-resolution favicon.
  - favicon.ico: vector favicon image.
- js
  - bump-chart.js: contains all code to create and interact with  the bump chart view.
  - game-detail.js: contains all code to create and interact with the game detail view.
  - game-table.js: contains all code to create and interact with the game table view.
  - script.js: contains code for data loading and initializing each view, as well as linking between views.
  - season-table.js: contains all code to create and interact with the points total chart view.
  - storytelling.js: contains the code for the storytelling aspect of the visualization.
- index.html: contains the basic HTML skeleton of the page.
