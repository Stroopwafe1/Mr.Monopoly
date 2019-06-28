const Tile = require('./Tile');

class Set {

    /**
     * This class is essential to check whether the current set is owned, and if so, allow the player to buy houses
     * @param {String} colour The name of the set
     * @param {Number} houseBuyPrice The price for the houses
     * @param {Array<Tile>} tiles The tiles that are in this set
     */
    constructor(colour, houseBuyPrice, tiles) {
        /**
         * The set 'name' as it were, e.g. blues, oranges, purples, etc...
         * @type {String}
         */
        this.colour = colour;

        /**
         * The price at which to buy the houses on a property tile
         * @type {Number}
         */
        this.houseBuyPrice = houseBuyPrice;

        /**
         * The tiles that are in this set
         * @type {Array<Tile>}
         */
        this.tiles = tiles;
    }

    /**
     * Checks if the set is owned by the player
     * @param {Tile} tile The tile at which to check if the set is owned by the player
     * @returns {boolean}
     */
    isSetOwned(tile) {
        return tile.ownedBy && this.tiles.every(looptile => tile.ownedBy.equals(looptile.ownedBy));
    }
}

module.exports = Set;