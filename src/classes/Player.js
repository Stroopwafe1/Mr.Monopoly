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
     * @param {String} [name] A name you set for yourself, default will be your username
     * @param {Image} [imgIcon] The image of your avatar, saved so it doesn't have to keep fetching it
     * @param {Number} [money] The amount of money the player starts with
     * @param {Number} [currentPosition] The position of the player
     * @param {Number} [cards] The amount of get out of jail free cards the player has
     * @param {boolean} [isTurn] A boolean to tell if it's the player's turn
     * @param {Array<Tile>} [properties] The properties the player has
     */
    constructor(board, id, name, imgIcon, money, currentPosition, cards, isTurn, properties) {

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
         * The name of the player, default is username
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
         * @type {Number}
         */
        this.money = money;

        /**
         * Whether the player is jailed or not
         * @type {boolean}
         */
        this.isJailed = false;

        /**
         * The current position of the player on the board
         * @type {Number}
         */
        this.currentPosition = currentPosition;

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
        this.amountGetOutOfJailCards = cards;

        /**
         * The amount of times the player has tried to escape jail
         * @type {Number}
         */
        this.jailTries = 0;

        /**
         * Whether it's the player's turn or not
         * @type {Boolean}
         */
        this.isTurn = isTurn;

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

        /**
         * The properties the player has
         * @type {Array<Tile>}
         */
        this.properties = properties;
    }

    /**
     * A function to check the available actions the player can take
     */
    checkAvailableActions() {
        //Clear the array so the actions don't stack up each turn
        this.allowedActions.length = 0;

        //The player can always roll the dice
        this.allowedActions.push('roll');

        //If the player is on a property and it's unowned, allow the user to buy
        if ((this.currentTile.type === 'PROPERTY' || this.currentTile.type === 'STATION' || this.currentTile.type === 'UTILITY') && !this.currentTile.ownedBy)
            this.allowedActions.push('buy');

        //If the player is on the jail tile and the player is jailed, allow the user to pay the bounty
        if (this.currentTile.type === 'JAIL' && this.isJailed)
            this.allowedActions.push('pay');

        //If the player is on the jail tile and the player is jailed and the player has any Get Out Of Jail Cards, allow the user to use said card
        if (this.currentTile.type === 'JAIL' && this.isJailed && this.amountGetOutOfJailCards > 0)
            this.allowedActions.push('card');

        //If the player owns the set of the current tile, allow the user to buy houses
        if (this.board.sets.find(set => set.isSetOwned(this.currentTile)))
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
            } else {
                this.doubles = 0;
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
        if (tile.ownedBy) {
            if (tile.ownedBy.equals(this)) {
                return vars.messages.get(this.board.guildID).push(`You already own this property`);
            } else {
                return vars.messages.get(this.board.guildID).push(`You can't buy a property that's already owned`);
            }
        } else {

            //Subtract the money from the player
            this.money -= tile.buyValue;

            //Set the owned state of the tile to the player
            tile.ownedBy = this;

            //Add it to the array of properties
            this.properties.push(tile);

            //Push the message of what happened to the global variables
            vars.messages.get(this.board.guildID).push(`${this.name} bought ${tile.name} for ${tile.buyValue}. ${this.money} remaining`);
        }
    }

    /**
     * Buys houses through referring to the buyhouses.js command
     * @param {String} messageContent 
     */
    buyHouses(messageContent) {
        const vars = require('../../globalvariables');
        const buyhouses = require('../../commands/buyhouses');
        buyhouses.run(messageContent.substring(messageContent.indexOf(' ')).trim(), this);
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

        //Land on the tile
        this.currentTile.landOn(this);
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
     * Pays the taxes
     * @param {Number} amount The amount to pay
     */
    payTax(amount) {
        this.money -= amount;
    }

    /**
     * Pays the provided player
     * @param {Player} player The player to pay to
     * @param {Number} amount The amount to play
     */
    payPlayer(player, amount) {
        player.money += amount;
        this.money -= amount;
    }

    /**
     * Pays the other players in the game, also pays this player but that gets nullified
     * @param {Number} amount The amount to pay the other players
     */
    payOthers(amount) {
        const vars = require('../../globalvariables');
        vars.players.get(this.board.guildID).forEach(player => this.payPlayer(player, amount));
    }

    /**
     * Pays the repairs in the game
     * @param {Number} amount1 The amount to charge per house
     * @param {Number} amount2 The amount to charge per hotel
     */
    payRepairs(amount1, amount2) {
        let ownedTiles = this.properties; //this.board.tiles.filter((tile) => tile.ownedBy.equals(this));
        let amountHouses = 0,
            amountHotels = 0;

        //Count the amount of hotels the player has
        //Hotels count as 5 houses
        let tilesWithHotels = ownedTiles.filter(tile => tile.amountHouses === 5);
        amountHotels = tilesWithHotels.length;

        //Count the amount of houses the player has
        let tilesWithHouses = ownedTiles.filter(tile => tile.amountHouses !== 0 || tile.amountHouses !== 5);
        tilesWithHouses.forEach(tile => {
            amountHouses += tile.amountHouses;
        });

        //Charge the player
        this.money -= (amountHouses * amount1 + amountHotels * amount2);
    }

    /**
     * Finds and returns the nearest space to the player
     * @param {Array<Number>} arrIndices The array of board indices
     * @returns {Number} The index
     */
    findNearest(arrIndices) {
        return arrIndices.filter(index => index > this.currentPosition)[0];
    }

    /**
     * Makes the player leave the game
     * Their properties will be set as unowned again
     */
    surrender() {
        const vars = require('../../globalvariables');

        if(!arguments)
            vars.messages.get(this.board.guildID).push(`${this.name} surrendered`);
        else
            vars.messages.get(this.board.guildID).push(`${this.name} was forced to surrender`);

        this.properties.forEach(tile => {
            tile.amountHouses = 0;
            tile.ownedBy = null;
        });

        let players = vars.players.get(this.board.guildID).filter(player => !player.equals(this));
        vars.players.set(this.board.guildID, players);
    }

    /**
     * Function of what to do when this player is eliminated by another
     * @param {Player} player The player who eliminated this player
     */
    eliminatedBy(player) {
        const vars = require('../../globalvariables');

        vars.messages.get(this.board.guildID).push(`${this.name} got eliminated by ${player.name}!!`);

        this.properties.forEach(tile => {
            tile.ownedBy = player;
            player.properties.push(tile);
        });

        let players = vars.players.get(this.board.guildID).filter(player => !player.equals(this));
        vars.players.set(this.board.guildID, players);
    }

    /**
     * Makes the player take a random card depending on the type
     * @param {String} Cardtype The type of the card: CC or CHANCE
     */
    takeCard(Cardtype) {
        let card;
        if (Cardtype === 'CC') {
            //Get the first card in the shuffled array
            card = this.board.cardsCC.shift();

            //Append it to the back --- Equal to putting it at the bottom of the stack IRL
            this.board.cardsCC.push(card);

            //Execute what the card needs to do
            card.execute(this);
        } else {
            //Same as above
            card = this.board.cardsChance.shift();
            this.board.cardsChance.push(card);
            card.execute(this);
        }
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

        //Land on the tile
        this.currentTile.landOn(this);
    }

    /**
     * Compares whether this player is equal to another
     * @param {Player} player 
     * @returns {boolean}
     */
    equals(player) {
        return player && player.id === this.id;
    }

    /**
     * Converts the player object into a string containing all the data
     */
    saveState() {
        let object = {
            'id':this.id,
            'm':this.money.toString(16),
            'p':this.currentPosition.toString(16),
            'c':this.amountGetOutOfJailCards,
            't':this.isTurn,
            's':[]
        };
        this.properties.forEach(tile => object.s.push(tile.saveState(this.board.tiles)));
        return object;
    }
}

module.exports = Player;