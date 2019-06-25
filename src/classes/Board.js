const Locales = require('./Locales');
const Tile = require('./Tile');
const Player = require('./Player');
const Set = require('./Set');

class Board {
    /**
     * 
     * @param {Snowflake} [id] The ID of the guild the board is on
     * @param {Locales} [locale] The locale to use for the text in the game
     */
    constructor(id, locale) {
        if (!locale || locale === undefined || locale === null) {
            console.log('no locale provided');
            locale = 'us-default';
        }

        /**
         * Setting the game as in progress, so it can't be instantiated again
         * @type {boolean}
         */
        this.isInProgress = true;

        /**
         * The guild id of this board
         * @type {Snowflake}
         */
        this.guildID = id;

        /**
         * Try and turn the given locale into one in the list of available locales
         */
        try {
            this.locale = convertLocaleToSuitable(locale);
        } catch {
            this.locale = convertLocaleToSuitable('us-default');
        }
        /**
         * All the tiles on the board ordered in an array
         * @type {Array<Tile>}
         */
        this.tiles = [
            //First side of the board, indices 0-9
            new Tile(this.locale.start, 0, 0, 0, 0, 0, 0, 0, 0, 'START'), //0
            new Tile(this.locale.brown1, 60, 0, 2, 10, 30, 90, 160, 250, 'PROPERTY'), //1
            new Tile(this.locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'), //2
            new Tile(this.locale.brown2, 80, 0, 4, 20, 60, 180, 320, 450, 'PROPERTY'), //3
            new Tile(this.locale.taxIncome, 0, 0, 0, 0, 0, 0, 0, 0, 'TAX'), //4
            new Tile(this.locale.railroad1, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'), //5
            new Tile(this.locale.cyan1, 100, 0, 6, 30, 90, 270, 400, 550, 'PROPERTY'), //6
            new Tile(this.locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'), //7
            new Tile(this.locale.cyan2, 100, 0, 6, 30, 90, 270, 400, 550, 'PROPERTY'), //8
            new Tile(this.locale.cyan3, 120, 0, 8, 40, 100, 300, 450, 600, 'PROPERTY'), //9

            //Second side of the board, indices 10-19
            new Tile(this.locale.jail, 0, 0, 0, 0, 0, 0, 0, 0, 'JAIL'), //10
            new Tile(this.locale.purple1, 140, 0, 10, 50, 150, 450, 625, 750, 'PROPERTY'), //11
            new Tile(this.locale.utility1, 150, 0, 0, 0, 0, 0, 0, 0, 'UTILITY'), //12
            new Tile(this.locale.purple2, 140, 0, 10, 50, 150, 450, 625, 750, 'PROPERTY'), //13
            new Tile(this.locale.purple3, 160, 0, 12, 60, 180, 500, 700, 900, 'PROPERTY'), //14
            new Tile(this.locale.railroad2, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'), //15
            new Tile(this.locale.orange1, 180, 0, 14, 70, 200, 550, 750, 950, 'PROPERTY'), //16
            new Tile(this.locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'), //17
            new Tile(this.locale.orange2, 180, 0, 14, 70, 200, 550, 750, 900, 'PROPERTY'), //18
            new Tile(this.locale.orange3, 200, 0, 16, 80, 220, 600, 800, 1000, 'PROPERTY'), //19

            //Third side of the board, indices 20-29
            new Tile(this.locale.freeParking, 0, 0, 0, 0, 0, 0, 0, 0, 'FREEPARKING'), //20
            new Tile(this.locale.red1, 220, 0, 18, 90, 250, 700, 875, 1050, 'PROPERTY'), //21
            new Tile(this.locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'), //22
            new Tile(this.locale.red2, 220, 0, 18, 90, 250, 700, 875, 1050, 'PROPERTY'), //23
            new Tile(this.locale.red3, 240, 0, 20, 100, 300, 750, 925, 1100, 'PROPERTY'), //24
            new Tile(this.locale.railroad3, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'), //25
            new Tile(this.locale.yellow1, 260, 0, 22, 110, 330, 800, 975, 1150, 'PROPERTY'), //26
            new Tile(this.locale.yellow2, 260, 0, 22, 110, 330, 800, 975, 1150, 'PROPERTY'), //27
            new Tile(this.locale.utility2, 150, 0, 0, 0, 0, 0, 0, 0, 'UTILITY'), //28
            new Tile(this.locale.yellow3, 280, 0, 24, 120, 360, 850, 1025, 1200, 'PROPERTY'), //29

            //Fourth side of the board, indices 30-39
            new Tile(this.locale.jailForced, 0, 0, 0, 0, 0, 0, 0, 0, 'JAIL'), //30
            new Tile(this.locale.green1, 300, 0, 26, 130, 390, 900, 1100, 1275, 'PROPERTY'), //31
            new Tile(this.locale.green2, 300, 0, 26, 130, 390, 900, 1100, 1275, 'PROPERTY'), //32
            new Tile(this.locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'), //33
            new Tile(this.locale.green3, 320, 0, 28, 150, 450, 1000, 1200, 1400, 'PROPERTY'), //34
            new Tile(this.locale.railroad4, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'), //35
            new Tile(this.locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'), //36
            new Tile(this.locale.blue1, 350, 0, 35, 175, 500, 1100, 1300, 1500, 'PROPERTY'), //37
            new Tile(this.locale.taxLuxury, 0, 0, 0, 0, 0, 0, 0, 0, 'TAX'), //38
            new Tile(this.locale.blue2, 500, 0, 50, 200, 600, 1400, 1700, 2000, 'PROPERTY'), //39
        ];

        /**
         * The sets of properties ordered in an array
         * @type {Array<Set>}
         */
        this.sets = [
            new Set('Browns', 50, this.tiles[1], this.tiles[3]),
            new Set('Cyans', 50, this.tiles[6], this.tiles[8], this.tiles[9]),
            new Set('Purples', 100, this.tiles[11], this.tiles[13], this.tiles[14]),
            new Set('Oranges', 100, this.tiles[16], this.tiles[18], this.tiles[19]),
            new Set('Reds', 150, this.tiles[21], this.tiles[23], this.tiles[24]),
            new Set('Yellows', 150, this.tiles[26], this.tiles[27], this.tiles[29]),
            new Set('Greens', 200, this.tiles[31], this.tiles[32], this.tiles[34]),
            new Set('Blues', 200, this.tiles[37], this.tiles[39])
        ];

    }

    /**
     * The command which will start the game
     */
    start() {
        //Require the global variables set by new.js
        const vars = require('../../globalvariables');

        //Reset the message array
        vars.messages.set(this.guildID, []);


        //Roll for each player and determine the order
        vars.players.get(this.guildID).forEach(player => {
            player.total = Math.floor(Math.random() * 12) + 1;
        });
        vars.players.get(this.guildID).sort((player1, player2) => player1.total > player2.total);

        /**
         * Using the emitter that transfers the messages from
         */
        let i = 0;
        vars.eventEmitter.addListener('message', (message) => {
            console.log(i);
            //on message emitted i++;
            
            let activePlayer = vars.players.get(this.guildID)[i];
            i = (i + 1) % vars.players.get(this.guildID).length;
            console.log(i);
            vars.messages.set(this.guildID, []);
            this.turn(activePlayer, message);
        });

        
        let activePlayer = vars.players.get(this.guildID)[0];
        let temp = vars.players.get(this.guildID).map(player => {
            if(player.equals(activePlayer)) {
                player.isTurn = true;
                return player;
            } else {
                player.isTurn = false;
                return player;
            }
        });
        vars.players.set(this.guildID, temp);
        let tempString = '';
        activePlayer.checkAvailableActions().forEach(action => tempString += `\`${action}\`, `);
        vars.channels.get(this.guildID).send(`It's your turn ${activePlayer.name}\nYou can do the following: ${tempString}`);
    }

    turn(player, message) {
        switch (message) {
            case 'roll':
                player.roll(); //Will set the player turn to false
                break;
            case 'buy':
                player.buy(player.currentTile); //Will set the player turn to false
                break;
            case 'pay':
                player.payBounty(); //Will set the player turn to false
                break;
            case 'card':
                player.useCard(); //Will set the player turn to false
                break;
        }
        const vars = require('../../globalvariables');
        let tempString = '';
        vars.messages.get(this.guildID).forEach(msg => tempString += `${msg}\n`);
        vars.channels.get(this.guildID).send(tempString);

        let nextPlayer = vars.players.get(this.guildID)[(vars.players.get(this.guildID).indexOf(player) + 1) % vars.players.get(this.guildID).length];
        let temp = vars.players.get(this.guildID).map(player => {
            if(player.equals(nextPlayer)) {
                player.isTurn = true;
                return player;
            } else {
                player.isTurn = false;
                return player;
            }
        });
        vars.players.set(this.guildID, temp);
        tempString = '';
        nextPlayer.checkAvailableActions().forEach(action => tempString += `\`${action}\`, `);
        vars.channels.get(this.guildID).send(`It's your turn ${nextPlayer.name}\nYou can do the following: ${tempString}`);
    }
}

module.exports = Board;

/**
 * 
 * @param {String} locale The string with which to get the desired locale
 * @returns {Locales}
 */
function convertLocaleToSuitable(locale) {
    //console.log(locale);
    let regex = /(\w+).(\w+)/;
    let matches = regex.exec(locale);
    //console.log(matches);
    return Locales.getLocale(matches[1], matches[2]);
}