const Tile = require('./Tile');

class Player {

    /**
     * The player class, This is where all the functionality is added to the Discord user
     * @param {String} [name] A name you set for yourself, default will be your Discord tag
     * @param {ImageData} [imgIcon] The image of your avatar, saved so it doesn't have to keep fetching it
     */
    constructor(name, imgIcon) {
        /**
         * The id of the Discord user
         * @type {Snowflake}
         */
        this.id = '';

        /**
         * The name of the player, default is Discord tag
         * @type {String}
         */
        this.name = name;

        /**
         * The image of the user's avatar, saved so it doesn't have to keep being fetched
         * @type {ImageData}
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
         * The tile the player is currently at
         * @type {Tile}
         */
        this.currentTile = null;
    }

    roll() {
        if (this.doubles === 3)
            this.teleport(10); //10 is the index for jail, after 3 doubles you should go to jail
        let diceRoll1 = Math.floor(Math.random() * 6) + 1; //Dice roll between 1 and 6
        let diceRoll2 = Math.floor(Math.random() * 6) + 1; //Dice roll between 1 and 6
        if (!this.isJailed) { //If the player isn't jailed do the following:
            this.isTurn = false; //Set the turn to false
            if (diceRoll1 === diceRoll2) { //If the player threw doubles
                this.doubles++;
                this.isTurn = true;
            }
            this.move(diceRoll1 + diceRoll2); //Move the player
        } else { //If the player IS jailed
            if (diceRoll1 === diceRoll2) {
                //Player escaped jail
                this.isJailed = false;
                this.move(diceRoll1 + diceRoll2);
            } else if (this.jailTries === 3) { //After 3 failed attempts to escape jail
                this.isJailed = false;
                this.money -= 50;
                this.jailTries = 0;
                this.move(diceRoll1 + diceRoll2);
            } else {
                this.jailTries++;
            }
        }
    }

    buyHouses() {

    }

    /**
     * Moves the player to amount of spaces
     * @param {*} spaces the spaces to move the player
     */
    move(spaces) {
        if (this.currentPosition + spaces >= 40) {
            //Player went past start
            this.money += 200;
        }
        this.currentPosition = (this.currentPosition + spaces) % 40; //There are only a total of 40 spaces on the board

    }

    /**
     * Teleports the player to the given index on the board.
     * See Board.js for the list of indices
     * @param {*} boardIndex The index on the board
     */
    teleport(boardIndex) {
        if (boardIndex === 10)
            this.isJailed = true;
        else {
            if(boardIndex < this.currentPosition) {
                //Player went past start
                this.money += 200;
            }
        }

        this.currentPosition = boardIndex;

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