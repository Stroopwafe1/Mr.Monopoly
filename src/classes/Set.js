const Tile = require('./Tile');

class Set {

    /**
     * This class is essential to check whether the current set is owned, and if so, allow the player to buy houses
     * @param {String} colour The name of the set
     * @param {Number} houseBuyPrice The price for the houses
     * @param {Tile} tile1 The first tile
     * @param {Tile} tile2 The second tile
     * @param {Tile} tile3 The third tile, if any
     */
    constructor(colour, houseBuyPrice, tile1, tile2, tile3) {
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
         * The first property tile in the set
         * @type {Tile}
         */
        this.tile1 = tile1;

        /**
         * The second property tile in the set
         * @type {Tile}
         */
        this.tile2 = tile2;

        /**
         * The third property tile in the set, if any
         * @type {Tile}
         */
        this.tile3 = tile3;

        /**
         * Check if a third tile was provided, if not, the set has two properties
         * @type {Number}
         */
        this.amountOfProperties = tile3 ? 3 : 2;
    }

    /**
     * Checks if the set is owned by the player
     * @param {Tile} tile The tile at which to check if the set is owned by the player
     * @returns {boolean}
     */
    isSetOwned(tile) {
        return tile.ownedBy.equals(this.tile1.ownedBy) && 
        tile.ownedBy.equals(this.tile2.ownedBy) && 
        (tile3 ? tile.ownedBy.equals(this.tile3) : true);
    }
}

module.exports = Set;