const Player = require('../src/classes/Player');

module.exports = {
    name: 'buyhouses',
    description: 'Buys the houses for your property in a format of <tile number>:<house number>. If you want 2 houses on your first and third tile, and 1 on your second, you\'d write: [m!buyhouses 1:2 2:1 3:2]',
    run(message, args) {
        const vars = require('../globalvariables');
        /**
         * Type of player
         * @type {Player}
         */
        let player;
        let housesArray;
        if (typeof message === 'string') {
            player = args;
            housesArray = houses(message);
        } else {
            player = vars.players.get(message.guild.id).find(player => player.id === message.author.id);
            housesArray = houses(message.content);
        }
        if(!player) return;
        //Set variable for the price of buying houses
        let set = player.currentTile.getSet(player);
        set.tiles.forEach((tile, index) => tile.amountHouses = housesArray[index]);
        let totalHouses = 0;
        housesArray.forEach(number => totalHouses += number);
        player.money -= totalHouses * set.houseBuyPrice;
    }
}

/**
 * Return the houses for each of the tiles
 * @param {String} message the message to get the houses from
 * @returns {Array<Number>}
 */
function houses(message) {
    let returnValue = [];
    let regex = /(\d)[:=](\d)/g;
    let matches = message.match(regex);
    matches.forEach(match => returnValue.push(Number(match.substring(2))));
    return returnValue;
}