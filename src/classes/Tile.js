const Player = require('./Player');

class Tile {
    /**
     * 
     * @param {String} name The name of the tile
     * @param {Number} buyValue The value this tile can be bought for
     * @param {Number} amountHouses The number of houses it has
     * @param {Number} rentNoHouses The rent with no houses
     * @param {Number} rent1House The rent with one house
     * @param {Number} rent2Houses The rent with two houses
     * @param {Number} rent3Houses The rent with three houses
     * @param {Number} rent4Houses The rent with four houses
     * @param {Number} rentHotel The rent with a hotel
     * @param {String} type The type of tile it is. E.g. PROPERTY/JAIL/TAX/STATION/CC/CHANCE/FREEPARKING/UTILITY/START
     */
    constructor(name, buyValue, amountHouses, rentNoHouses, rent1House, rent2Houses, rent3Houses, rent4Houses, rentHotel, type) {
        /**
         * The name of the tile, can be configured with the locales
         * @type {String}
         */
        this.name = name;

        /**
         * The value the tile has to be bought for
         * @type {Number}
         */
        this.buyValue = buyValue;

        /**
         * The amount of houses this tile has
         * @type {Number}
         */
        this.amountHouses = amountHouses;

        /**
         * The rent with no houses
         * @type {Number}
         */
        this.rentNoHouses = rentNoHouses;

        /**
         * The rent with one house
         * @type {Number}
         */
        this.rent1House = rent1House;

        /**
         * the rent with two houses
         * @type {Number}
         */
        this.rent2Houses = rent2Houses;

        /**
         * The rent with three houses
         * @type {Number}
         */
        this.rent3Houses = rent3Houses;

        /**
         * The rent with four houses
         * @type {Number}
         */
        this.rent4Houses = rent4Houses;

        /**
         * The rent with a hotel
         * @type {Number}
         */
        this.rentHotel = rentHotel;

        /**
         * The type of the tile.
         * Can be: PROPERTY/JAIL/TAX/STATION/CC/CHANCE/FREEPARKING/UTILITY/START
         * @type {String}
         */
        this.type = type;

        /**
         * The player that owns this tile
         * @type {Player}
         */
        this.ownedBy = null;
    }

    /**
     * Compares the given tile to another
     * @param {Tile} tile The tile to compare with
     * @returns {boolean}
     */
    equals(tile) {
        let equal = tile && 
        this.name === tile.name && 
        this.buyValue === tile.buyValue;

        return equal;
    }
}

module.exports = Tile;