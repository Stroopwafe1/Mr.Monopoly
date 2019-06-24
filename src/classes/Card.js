const Player = require('./Player');

class Card {

    /**
     * The type of the card; e.g. TELEPORT/TAX/JAILCARD
     * @type {String}
     */
    type = '';

    /**
     * The value with which to execute the type. 
     * A type of TAX would tax you this amount, a type of TELEPORT would teleport you to this tile index
     * @type {Number}
     */
    value = 0;

    /**
     * The text on the card itself.
     * @type {String}
     */
    text = '';

    /**
     * This class is meant as as easy way to add the functionality of the chance/community chest cards into the game
     * @param [type] The type of the card; e.g: TELEPORT/TAX/JAILCARD
     * @param [value] The value with which to execute the type. A type of TAX would tax you this amount, etc...
     * @param [text] The text on the actual card
     */
    constructor(type, value, text) {
        this.type = type;
        this.value = value;
        this.text = text;
    }

    /**
     * Performs an action on the given player
     * @param {Player} player the player to perform the actions on
     */
    execute(player) {
        if (!player instanceof Player) throw new Error("Player parameter isn't a Player");
        
        switch (this.type) {
            case 'TELEPORT':
                player.teleport(this.value);
                break;
            case 'TAX':
                player.money -= this.value;
                break;
            case 'JAILCARD':
                player.amountGetOutOfJailCards++;
                break;
            default:
                throw new Error("Don't recognise the given card type");
        }
    }
}

module.exports = Card