const Player = require('./Player');

class Card {
    /**
     * This class is meant as as easy way to add the functionality of the chance/community chest cards into the game
     * @param {String} type The type of the card; e.g: TELEPORT/TAX/JAILCARD/NEARTP/MOVE/REPAIRS/OTHERS
     * @param {Array<Number>} values The values with which to execute the type. A type of NEARTP would teleport the player to the closest of these values.
     * @param {String} text  The text on the actual card
     */
    constructor(type, values, text) {
        /**
         * The type of the card; e.g. TELEPORT/TAX/JAILCARD/NEARTP/MOVE/REPAIRS/OTHERS
         * @type {String}
         */
        this.type = type;

        /**
         * The values with which to execute the type. 
         * For single values, just enter one value
         * A type of NEARTP would teleport the player to the closest of these values.
         * @type {Array<Number>}
         */
        this.values = values;

        /**
         * The text on the card itself.
         * @type {String}
         */
        this.text = text;
    }

    /**
     * Performs an action on the given player
     * @param {Player} player the player to perform the actions on
     */
    execute(player) {
        const vars = require('../../globalvariables');

        vars.messages.get(player.board.guildID).push(`${this.text}`);
        switch (this.type) {
            case 'TELEPORT':
                //Teleports the player
                player.teleport(this.values[0]);
                break;
            case 'TAX':
                //Tax the player
                player.payTax(this.values[0]);
                break;
            case 'JAILCARD':
                //Add one to the Get Out Of Jail Free cards
                player.amountGetOutOfJailCards++;
                break;
            case 'NEARTP':
                //Teleport the player to the nearest tile
                player.teleport(player.findNearest(this.values));
                break;
            case 'MOVE':
                //Moves the player
                player.move(this.values[0]);
                break;
            case 'REPAIRS':
                //Pay the repair costs
                player.payRepairs(this.values[0], this.values[1]);
                break;
            case 'OTHERS':
                //Pays or receives money from, other players
                player.payOthers(this.values[0]);
                break;
            default:
                //This should never happen
                throw new Error("Don't recognise the given card type");
        }
    }
}

module.exports = Card