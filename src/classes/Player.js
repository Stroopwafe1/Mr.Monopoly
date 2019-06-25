const Tile = require('./Tile');
const Board = require('./Board');
const {
    Image
} = require('canvas');


class Player {

    /**
     * The player class, This is where all the functionality is added to the Discord user
     * @param {Board} [board] The board the player plays on
     * @param {Snowflake} [id] The user's discord id
     * @param {String} [name] A name you set for yourself, default will be your Discord tag
     * @param {Image} [imgIcon] The image of your avatar, saved so it doesn't have to keep fetching it
     */
    constructor(board, id, name, imgIcon) {

        /**
         * The board that the player plays on
         * @type {Board}
         */
        this.board = board;

        /**
         * The id of the Discord user
         * @type {Snowflake}
         */
        this.id = id;

        /**
         * The name of the player, default is Discord tag
         * @type {String}
         */
        this.name = name;

        /**
         * The image of the user's avatar, saved so it doesn't have to keep being fetched
         * @type {Image}
         */
        this.imgIcon = imgIcon;

        /**
         * The money that the player has
         * @default 2000
         * @type {Number}
         */
        this.money = 2000;

        /**
         * Whether the player is jailed or not
         * @type {boolean}
         */
        this.isJailed = false;

        /**
         * The current position of the player on the board
         * @type {Number}
         */
        this.currentPosition = 0;

        /**
         * The amount of stations the player has
         * @type {Number}
         */
        this.amountStations = 0;

        /**
         * The amount of utilities the player has
         * @type {Number}
         */
        this.amountUtilities = 0;

        /**
         * The amount of Get Out of Jail cards the player has
         * @type {Number}
         */
        this.amountGetOutOfJailCards = 0;

        /**
         * The amount of times the player has tried to escape jail
         * @type {Number}
         */
        this.jailTries = 0;

        /**
         * Whether it's the player's turn or not
         * @type {Boolean}
         */
        this.isTurn = false;

        /**
         * The amount of doubles the player has thrown already
         * @type {Number}
         */
        this.doubles = 0;

        /**
         * The addition of both dice throws
         */
        this.total = 0;

        /**
         * The tile the player is currently at
         * @type {Tile}
         */
        this.currentTile = this.board.tiles[this.currentPosition];

        /**
         * The allowed actions the player can take
         * @type {Array<String>}
         */
        this.allowedActions = [];
    }

    /**
     * A function to check the available actions the player can take
     */
    checkAvailableActions() {
        //Clear the array so the actions don't stack up each turn
        this.allowedActions.length = 0;

        console.log(this.currentTile);

        //The player can always roll the dice
        this.allowedActions.push('roll');

        //If the player is on a property and it's unowned, allow the user to buy
        if(this.currentTile.type === 'PROPERTY' && !this.currentTile.ownedBy) 
            this.allowedActions.push('buy');

        //If the player is on the jail tile and the player is jailed, allow the user to pay the bounty
        if(this.currentTile.type === 'JAIL' && this.isJailed) 
            this.allowedActions.push('pay');

        //If the player is on the jail tile and the player is jailed and the player has any Get Out Of Jail Cards, allow the user to use said card
        if(this.currentTile.type === 'JAIL' && this.isJailed && this.amountGetOutOfJailCards > 0) 
            this.allowedActions.push('card');

        //If the player owns the set of the current tile, allow the user to buy houses
        if(this.board.sets.find(set => set.isSetOwned(this.currentTile)))
            this.allowedActions.push('house');
        
        return this.allowedActions;
    }

    /**
     * A roll command, determines the dice roll and what to do with it
     */
    roll() {
        const vars = require('../../globalvariables');
        if (this.doubles === 3)
            this.teleport(10); //10 is the index for jail, after 3 doubles you should go to jail
        let diceRoll1 = Math.floor(Math.random() * 6) + 1; //Dice roll between 1 and 6
        let diceRoll2 = Math.floor(Math.random() * 6) + 1; //Dice roll between 1 and 6
        this.isTurn = false; //Set the turn to false
        this.total = diceRoll1 + diceRoll2;
        vars.messages.get(this.board.guildID).push(`${this.name} threw ${this.total}!`);
        if (!this.isJailed) { //If the player isn't jailed do the following:
            if (diceRoll1 === diceRoll2) { //If the player threw doubles
                vars.messages.get(this.board.guildID).push(`DOUBLES!`);
                this.doubles++;
                this.isTurn = true;
            }
            this.move(this.total); //Move the player
        } else { //If the player IS jailed
            if (diceRoll1 === diceRoll2) {
                //Player escaped jail
                vars.messages.get(this.board.guildID).push(`DOUBLES! You escaped jail`);
                this.isJailed = false;
                this.move(this.total);
            } else if (this.jailTries === 3) { //After 3 failed attempts to escape jail
                this.payBounty();
                this.move(this.total);
            } else {
                this.jailTries++;
            }
        }
    }

    /**
     * Buy the property
     * @param {Tile} tile The tile the player is on
     */
    buy(tile) {
        const vars = require('../../globalvariables');
        //Subtract the money from the player
        this.money -= tile.buyValue;

        //Set the owned state of the tile to the player
        tile.ownedBy = this;

        //Push the message of what happened to the global variables
        vars.messages.get(this.board.guildID).push(`${this.name} bought ${tile.name} for ${tile.buyValue}. ${this.money} remaining`);
    }

    buyHouses() {
        const vars = require('../../globalvariables');

    }

    /**
     * Moves the player to amount of spaces
     * @param {Number} spaces the spaces to move the player
     */
    move(spaces) {
        const vars = require('../../globalvariables');
        if (this.currentPosition + spaces >= 40) {
            //Player went past start
            this.money += 200;
            vars.messages.get(this.board.guildID).push(`${this.name} went past start and collected 200`);
        }
        //Set the new position of the player
        this.currentPosition = (this.currentPosition + spaces) % 40; //There are only a total of 40 spaces on the board

        //Save the Tile the player 'was' on
        let previousTile = this.currentTile;

        //Set the new Tile of the player
        this.currentTile = this.board.tiles[this.currentPosition];

        //Push the message of what happened to the global variables
        vars.messages.get(this.board.guildID).push(`${this.name} moved from ${previousTile.name} to ${this.currentTile.name}`);
    }

    /**
     * Pays the jail bounty
     */
    payBounty() {
        this.money -= 50;
        this.isJailed = false;
        this.jailTries = 0;
    }

    useCard() {
        this.isJailed = false;
        this.amountGetOutOfJailCards--;
    }

    /**
     * Teleports the player to the given index on the board.
     * See Board.js for the list of indices
     * @param {Number} boardIndex The index on the board
     */
    teleport(boardIndex) {
        const vars = require('../../globalvariables');
        if (boardIndex === 10) {
            this.isJailed = true;
            if (this.amountGetOutOfJailCards > 0)
                vars.messages.get(this.board.guildID).push(`${this.name} got sent to jail, ${3 - this.jailTries} tries remaining to get out, or use one of your Get Out Of Jail cards`);
            else
                vars.messages.get(this.board.guildID).push(`${this.name} got sent to jail, ${3 - this.jailTries} tries remaining to get out`);
        } else {
            if (boardIndex < this.currentPosition) {
                //Player went past start
                this.money += 200;
                vars.messages.get(this.board.guildID).push(`${this.name} went past start and collected 200`);
            }
        }

        this.currentPosition = boardIndex;
        let previousTile = this.currentTile;
        this.currentTile = this.board.tiles[this.currentPosition];
        vars.messages.get(this.board.guildID).push(`${this.name} got sent from ${previousTile.name} to ${this.currentTile.name}`);
    }

    /**
     * Compares whether this player is equal to another
     * @param {Player} player 
     * @returns {boolean}
     */
    equals(player) {
        return player && player.id === this.id;
    }
}

module.exports = Player;