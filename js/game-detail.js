/** Class implementing the game detail view. */
class GameDetail {

    constructor(updateGame) {
        this.updateGame = updateGame;
        // We need to figure out the best way to load in data for individual games when necessary.
        // Should it be done here, or in the main script.js file? Currently I've included a skeletal code for it in the main file.
        // How are we going to get that data to here? Do we want to create a new GameDetail each time we load new data in,
        // or do we want to just change the in a single GameDetail object?
    }

    drawDiv() {
        // Draw the div that will superimpose on the screen with the game data (the div will be present in the main page HTML, but hidden)
    }

}
