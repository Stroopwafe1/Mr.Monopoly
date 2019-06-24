const Locales = require('./Locales');
const Tile = require('./Tile');
const Player = require('./Player');
const Set = require('./Set');

class Board {
    /**
     * 
     * @param {Locales} [locale] The locale to use for the text in the game
     */
    constructor(locale) {

        this.isInProgress = true;

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
            new Tile(locale.start, 0, 0, 0, 0, 0, 0, 0, 0, 'START'),                    //0
            new Tile(locale.brown1, 60, 0, 2, 10, 30, 90, 160, 250, 'PROPERTY'),        //1
            new Tile(locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'),              //2
            new Tile(locale.brown2, 80, 0, 4, 20, 60, 180, 320, 450, 'PROPERTY'),       //3
            new Tile(locale.taxIncome, 0, 0, 0, 0, 0, 0, 0, 0, 'TAX'),                  //4
            new Tile(locale.railroad1, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'),      //5
            new Tile(locale.cyan1, 100, 0, 6, 30, 90, 270, 400, 550, 'PROPERTY'),       //6
            new Tile(locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'),                  //7
            new Tile(locale.cyan2, 100, 0, 6, 30, 90, 270, 400, 550, 'PROPERTY'),       //8
            new Tile(locale.cyan3, 120, 0, 8, 40, 100, 300, 450, 600, 'PROPERTY'),      //9

            //Second side of the board, indices 10-19
            new Tile(locale.jail, 0, 0, 0, 0, 0, 0, 0, 0, 'JAIL'),                      //10
            new Tile(locale.purple1, 140, 0, 10, 50, 150, 450, 625, 750, 'PROPERTY'),   //11
            new Tile(locale.utility1, 150, 0, 0, 0, 0, 0, 0, 0, 'UTILITY'),             //12
            new Tile(locale.purple2, 140, 0, 10, 50, 150, 450, 625, 750, 'PROPERTY'),   //13
            new Tile(locale.purple3, 160, 0, 12, 60, 180, 500, 700, 900, 'PROPERTY'),   //14
            new Tile(locale.railroad2, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'),      //15
            new Tile(locale.orange1, 180, 0, 14, 70, 200, 550, 750, 950, 'PROPERTY'),   //16
            new Tile(locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'),              //17
            new Tile(locale.orange2, 180, 0, 14, 70, 200, 550, 750, 900, 'PROPERTY'),   //18
            new Tile(locale.orange3, 200, 0, 16, 80, 220, 600, 800, 1000, 'PROPERTY'),  //19

            //Third side of the board, indices 20-29
            new Tile(locale.freeParking, 0, 0, 0, 0, 0, 0, 0, 0, 'FREEPARKING'),        //20
            new Tile(locale.red1, 220, 0, 18, 90, 250, 700, 875, 1050, 'PROPERTY'),     //21
            new Tile(locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'),                  //22
            new Tile(locale.red2, 220, 0, 18, 90, 250, 700, 875, 1050, 'PROPERTY'),     //23
            new Tile(locale.red3, 240, 0, 20, 100, 300, 750, 925, 1100, 'PROPERTY'),    //24
            new Tile(locale.railroad3, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'),      //25
            new Tile(locale.yellow1, 260, 0, 22, 110, 330, 800, 975, 1150, 'PROPERTY'), //26
            new Tile(locale.yellow2, 260, 0, 22, 110, 330, 800, 975, 1150, 'PROPERTY'), //27
            new Tile(locale.utility2, 150, 0, 0, 0, 0, 0, 0, 0, 'UTILITY'),             //28
            new Tile(locale.yellow3, 280, 0, 24, 120, 360, 850, 1025, 1200, 'PROPERTY'),//29

            //Fourth side of the board, indices 30-39
            new Tile(locale.jailForced, 0, 0, 0, 0, 0, 0, 0, 0, 'JAIL'),                //30
            new Tile(locale.green1, 300, 0, 26, 130, 390, 900, 1100, 1275, 'PROPERTY'), //31
            new Tile(locale.green2, 300, 0, 26, 130, 390, 900, 1100, 1275, 'PROPERTY'), //32
            new Tile(locale.communityChest, 0, 0, 0, 0, 0, 0, 0, 0, 'CC'),              //33
            new Tile(locale.green3, 320, 0, 28, 150, 450, 1000, 1200, 1400, 'PROPERTY'),//34
            new Tile(locale.railroad4, 200, 0, 25, 50, 100, 200, 0, 0, 'STATION'),      //35
            new Tile(locale.chance, 0, 0, 0, 0, 0, 0, 0, 0, 'CHANCE'),                  //36
            new Tile(locale.blue1, 350, 0, 35, 175, 500, 1100, 1300, 1500, 'PROPERTY'), //37
            new Tile(locale.taxLuxury, 0, 0, 0, 0, 0, 0, 0, 0, 'TAX'),                  //38
            new Tile(locale.blue2, 500, 0, 50, 200, 600, 1400, 1700, 2000, 'PROPERTY'), //39
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
}

module.exports = Board;

/**
 * 
 * @param {String} locale The string with which to get the desired locale
 * @returns {Locales}
 */
function convertLocaleToSuitable(locale) {
    let regex = /(\w+).(\w+)/;
    let matches = locale.match(regex);
    return Locales.getLocale(matches[0], matches[1]);
}