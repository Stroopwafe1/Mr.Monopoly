const Player = require('./Player');
const Set = require('./Set');

class Tile {
    /**
     * 
     * @param {String} name The name of the tile
     * @param {Number} buyValue The value this tile can be bought for
     * @param {Number} amountHouses The number of houses it has
     * @param {Number} rentNoHouses The rent with no houses OR the tax value
     * @param {Number} rent1House The rent with one house
     * @param {Number} rent2Houses The rent with two houses
     * @param {Number} rent3Houses The rent with three houses
     * @param {Number} rent4Houses The rent with four houses
     * @param {Number} rentHotel The rent with a hotel
     * @param {String} type The type of tile it is. E.g. PROPERTY/JAIL/JAILTP/TAX/STATION/CC/CHANCE/FREEPARKING/UTILITY/START
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
     * What to do when the tile is landed on by the player
     * @param {Player} player The player that lands on the tile
     */
    landOn(player) {
        const vars = require('../../globalvariables');

        if (this.ownedBy && this.ownedBy.equals(player)) return;

        switch (this.type) {
            case 'CC':
                //pull out a community chest card
                player.takeCard('CC');
                if(player.money <= 0)
                    player.surrender('forced');
                break;
            case 'CHANCE':
                //pull out a chance card
                player.takeCard('CHANCE');
                if(player.money <= 0)
                    player.surrender('forced');
                break;
            case 'JAILTP':
                player.teleport(10);
                break;
            case 'JAIL':
                //Everything is taken care of by the player class
                break;
            case 'TAX':
                player.payTax(this.rentNoHouses);
                vars.messages.get(player.board.guildID).push(`You paid ${this.rentNoHouses} for tax. ${player.money} left`);
                if(player.money <= 0)
                    player.surrender('forced');
                break;
            case 'STATION':
                if (this.ownedBy) {
                    let rent = 0;
                    switch (this.ownedBy.amountStations) {
                        case 1:
                            rent = this.rentNoHouses;
                            break;
                        case 2:
                            rent = this.rent1House;
                            break;
                        case 3:
                            rent = this.rent2Houses;
                            break;
                        case 4:
                            rent = this.rent3Houses;
                            break;
                    }
                    player.payPlayer(this.ownedBy, rent);
                    vars.messages.get(player.board.guildID).push(`You paid the player ${this.ownedBy.name} ${rent}. ${player.money} left`);

                    if(player.money <= 0)
                        player.eliminatedBy(this.ownedBy);
                }
                break;
            case 'PROPERTY':
                if (this.ownedBy) {
                    let rent = 0;
                    switch (this.amountHouses) {
                        case 0:
                            rent = this.rentNoHouses;
                            break;
                        case 1:
                            rent = this.rent1House;
                            break;
                        case 2:
                            rent = this.rent2Houses;
                            break;
                        case 3:
                            rent = this.rent3Houses;
                            break;
                        case 4:
                            rent = this.rent4Houses;
                            break;
                        case 5:
                            rent = this.rentHotel;
                            break;
                    }
                    player.payPlayer(this.ownedBy, rent);
                    vars.messages.get(player.board.guildID).push(`You paid the player ${this.ownedBy.name} ${rent}. ${player.money} left`);

                    if(player.money <= 0)
                        player.eliminatedBy(this.ownedBy);
                }
                break;
            case 'UTILITY':
                if(this.ownedBy) {
                    let rent = 0;
                    switch(this.ownedBy.amountUtilities) {
                        case 1:
                            rent = 4 * player.total;
                            break;
                        case 2:
                            rent = 10 * player.total;
                            break;
                    }
                    player.payPlayer(this.ownedBy, rent);
                    vars.messages.get(player.board.guildID).push(`You paid the player ${this.ownedBy.name} ${rent}. ${player.money} left`);

                    if(player.money <= 0)
                        player.eliminatedBy(this.ownedBy);
                }
                break;
            case 'START':
                player.money += 200;
                vars.messages.get(player.board.guildID).push(`You landed on start! 200 added. You currently have ${player.money}`);
                break;
        }
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

    /**
     * The save state for this tile
     * @param {Array<Tile>} tiles The tiles array for easy accessing 
     */
    saveState(tiles) {
        let object = {
            'i':tiles.indexOf(this).toString(16),
            'h':this.amountHouses
        };
        return object;

        let tempString = '{';
        tempString += `${tiles.indexOf(this).toString(16)}:`;
        tempString += `h:${this.amountHouses}`;
        return `${tempString}}`;
    }

    /**
     * Returns the set that this tile is a part of
     * @param {Player} player The player argument for easy access
     * @returns {Set}
     */
    getSet(player) {
        return player.board.sets.find(set => set.tiles.includes(this));
    }

    /**
     * Returns the index of this tile in the array
     * @param {Array<Tile>} tiles The tiles array
     * @returns {Number}
     */
    getIndex(tiles) {
        return tiles.indexOf(this);
    }
}

module.exports = Tile;