const Locales = require('./Locales');
const Tile = require('./Tile');
const Player = require('./Player');
const Set = require('./Set');
const Card = require('./Card');

const Discord = require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
class Board {
    /**
     * 
     * @param {Snowflake} [id] The ID of the guild the board is on
     * @param {String} [locale] The locale to use for the text in the game
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
         * The name of the locale, for saving the game
         */
        this.localeName = locale;

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
            new Tile(this.locale.taxIncome, 0, 0, 200, 0, 0, 0, 0, 0, 'TAX'), //4
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
            new Tile(this.locale.taxLuxury, 0, 0, 100, 0, 0, 0, 0, 0, 'TAX'), //38
            new Tile(this.locale.blue2, 500, 0, 50, 200, 600, 1400, 1700, 2000, 'PROPERTY'), //39
        ];

        /**
         * The sets of properties ordered in an array
         * @type {Array<Set>}
         */
        this.sets = [
            new Set('Browns', 50, [this.tiles[1], this.tiles[3]]),
            new Set('Cyans', 50, [this.tiles[6], this.tiles[8], this.tiles[9]]),
            new Set('Purples', 100, [this.tiles[11], this.tiles[13], this.tiles[14]]),
            new Set('Oranges', 100, [this.tiles[16], this.tiles[18], this.tiles[19]]),
            new Set('Reds', 150, [this.tiles[21], this.tiles[23], this.tiles[24]]),
            new Set('Yellows', 150, [this.tiles[26], this.tiles[27], this.tiles[29]]),
            new Set('Greens', 200, [this.tiles[31], this.tiles[32], this.tiles[34]]),
            new Set('Blues', 200, [this.tiles[37], this.tiles[39]])
        ];

        /**
         * The chance cards ordered in an array
         * @type {Array<Card>}
         */
        this.cardsChance = [
            new Card('TELEPORT', [0], this.locale.cardsChanceStart),
            new Card('TELEPORT', [24], this.locale.cardsChanceRed3),
            new Card('TELEPORT', [11], this.locale.cardsChancePurple1),
            new Card('NEARTP', [12, 28], this.locale.cardsChanceUtility),
            new Card('NEARTP', [5, 15, 25, 35], this.locale.cardsChanceRailroadNearest),
            new Card('NEARTP', [5, 15, 25, 35], this.locale.cardsChanceRailroadNearest),
            new Card('TAX', [-50], this.locale.cardsChanceDividend),
            new Card('JAILCARD', [1], this.locale.cardsChanceJail),
            new Card('MOVE', [-3], this.locale.cardsChance3Spaces),
            new Card('TELEPORT', [10], this.locale.cardsChanceJailForce),
            new Card('REPAIRS', [25, 100], this.locale.cardsChanceRepairs),
            new Card('TAX', [15], this.locale.cardsChanceSpeeding),
            new Card('TELEPORT', [5], this.locale.cardsChanceRailroad1),
            new Card('TELEPORT', [39], this.locale.cardsChanceBlue2),
            new Card('OTHERS', [50], this.locale.cardsChanceChairman),
            new Card('TAX', [-150], this.locale.cardsChanceLoan),
            new Card('TAX', [-100], this.locale.cardsChanceCrossword)
        ];

        /**
         * The community chest cards ordered in an array
         * @type {Array<Card>}
         */
        this.cardsCC = [
            new Card('TELEPORT', [0], this.locale.cardsCCStart),
            new Card('TAX', [-200], this.locale.cardsCCBankError),
            new Card('TAX', [50], this.locale.cardsCCDoctor),
            new Card('TAX', [-50], this.locale.cardsCCStock),
            new Card('JAILCARD', [1], this.locale.cardsCCJail),
            new Card('TELEPORT', [10], this.locale.cardsCCJailForce),
            new Card('OTHERS', [-50], this.locale.cardsCCOperaNight),
            new Card('TAX', [-100], this.locale.cardsCCHoliday),
            new Card('TAX', [-20], this.locale.cardsCCTaxRefund),
            new Card('OTHERS', [-10], this.locale.cardsCCBirthday),
            new Card('TAX', [-100], this.locale.cardsCCInsuranceLife),
            new Card('TAX', [100], this.locale.cardsCCHospital),
            new Card('TAX', [50], this.locale.cardsCCSchool),
            new Card('TAX', [-25], this.locale.cardsCCConsultancy),
            new Card('REPAIRS', [40, 115], this.locale.cardsCCRepairs),
            new Card('TAX', [-10], this.locale.cardsCCBeauty),
            new Card('TAX', [-100], this.locale.cardsCCInherit)
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

        //Shuffle the cards into a random order
        this.cardsCC = this.shuffleCards(this.cardsCC);
        this.cardsChance = this.shuffleCards(this.cardsChance);

        //If there aren't any arguments provided, choose a random order of the players
        if (arguments.length === 0) {
            //Roll for each player and determine the order
            vars.players.get(this.guildID).forEach(player => {
                player.total = Math.floor(Math.random() * 12) + 1;
            });
            vars.players.get(this.guildID).sort((player1, player2) => player1.total > player2.total);
        } else {
            vars.players.set(this.guildID, arguments[0]);
        }

        /**
         * Using the emitter that transfers the messages from
         */
        let i = 0;
        vars.eventEmitter.addListener('message', (message) => {
            let activePlayer = vars.players.get(this.guildID)[i];
            if (!activePlayer.isTurn) {
                i = (i + 1) % vars.players.get(this.guildID).length;
                activePlayer = vars.players.get(this.guildID)[i];
                activePlayer.isTurn = true;
            }
            vars.messages.set(this.guildID, []);
            this.turn(activePlayer, message);
        });


        let activePlayer = vars.players.get(this.guildID)[0];
        let temp = vars.players.get(this.guildID).map(player => {
            if (player.equals(activePlayer)) {
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

    /**
     * Takes the turn for the active player.
     * Once it's done, switch to the next player
     * @param {Player} player The player whose turn it is
     * @param {String} message The message string received
     */
    async turn(player, message) {
        const vars = require('../../globalvariables');
        let regex = /(roll|buy|pay|card|house)/;
        let match = regex.exec(message)[0];

        if(!player.checkAvailableActions().includes(match)) {
            let tempString = '';
            player.checkAvailableActions().forEach(action => tempString += `\`${action}\`, `);
            return vars.channels.get(this.guildID).send(`This is not a possible option, your options are: ${tempString}`);
        }
        switch (match) {
            case 'roll':
                player.roll();
                break;
            case 'buy':
                player.buy(player.currentTile);
                break;
            case 'pay':
                player.payBounty();
                break;
            case 'card':
                player.useCard();
                break;
            case 'house':
                player.buyHouses(message);
                break;
        }
        let tempString = '';
        //Loop through all the messages gathered and append them to the string
        vars.messages.get(this.guildID).forEach(msg => tempString += `${msg}\n`);

        //Display the board in the text channel
        let attachment = await this.paint();
        //Make an embed
        let Embed = new Discord.RichEmbed()

            //Attach the image as a Discord.Attachment
            .attachFile(attachment)

            //Set the image as the attachment drawn from the canvas
            .setImage('attachment://board.png')

            //Set the title to the player name
            .setTitle(player.name)

            //Set the colour to 'monopoly white'
            .setColor('#FFFFFF')

            //Set the description to the text of what happened this turn
            .setDescription(tempString)

            //Set the footer to the save string
            .setFooter(this.saveGame());

        //And finally, send it
        await vars.channels.get(this.guildID).send({
            embed: Embed
        });

        //Check if there's only one player left
        if (vars.players.get(this.guildID).length === 1) {
            //The player who won
            let victor = vars.players.get(this.guildID)[0];
            vars.channels.get(this.guildID).send(`${victor.name} has won the game!! Thank you all for playing!`);

            //Set the state of the game as playing to false
            this.isInProgress = false;
            //update it in the global variables
            vars.boards.set(this.guildID, this);
        }

        if (!player.isTurn) {
            let nextPlayer = vars.players.get(this.guildID)[(vars.players.get(this.guildID).indexOf(player) + 1) % vars.players.get(this.guildID).length];
            let temp = vars.players.get(this.guildID).map(player => {
                if (player.equals(nextPlayer)) {
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
        } else {
            tempString = '';
            player.checkAvailableActions().forEach(action => tempString += `\`${action}\`, `);
            vars.channels.get(this.guildID).send(`It's still your turn ${player.name}\nYou can do the following: ${tempString}`);
        }
    }

    /**
     * Shuffles the cards into a random order
     * @param {Array<Card>} arrCards The card array to shuffle
     * @returns {Array<Card>}
     */
    shuffleCards(arrCards) {
        for (let i = arrCards.length - 1; i > 0; i--) {
            //Set the index to a random index of the array
            const j = Math.floor(Math.random() * (i + 1));

            //"Swap" the arrays as it were
            [arrCards[i], arrCards[j]] = [arrCards[j], arrCards[i]];
        }
        return arrCards;
    }

    /**
     * Go through each player and saves their current state
     * @returns {String}
     */
    saveGame() {
        let object = {
            'l': this.localeName,
            'p': []
        };

        //Require the state of the game through the global variables
        const vars = require('../../globalvariables');

        //Get all the players currently playing
        let players = vars.players.get(this.guildID);

        //For each player, append their current state
        players.forEach((player, index) => {
            let tempObj = {
                'i': index,
                'p': player.saveState()
            };
            object.p.push(tempObj);
        });

        //Return the state
        return `Save: ${JSON.stringify(object)}`;
    }

    /**
     * Loads the game from the given string
     * @param {Discord.Guild} guild The guild object itself
     * @param {String} string The save string/object
     */
    static loadGame(guild, string) {
        const vars = require('../../globalvariables');
        const Player = require('./Player');
        let saveObject = {};
        try {
            saveObject = JSON.parse(string);
        } catch (err) {
            console.error(err);
            throw err;
        }

        const board = new Board(guild.id, saveObject.l);
        Promise.all(saveObject.p.map(async p => {
            let guildmember = guild.members.find(guildMember => guildMember.id === p.p.id);
            const { body: buffer} = await snekfetch.get(guildmember.user.displayAvatarURL);
            const avatar = await Canvas.loadImage(buffer);

            //Get the properties of the player
            let tiles = p.p.s.map(s => {
                let tile = board.tiles[parseInt(s.i, 16)];
                tile.amountHouses = s.h;
                return tile;
            });
            return new Player(board, p.p.id, guildmember.displayName, avatar, parseInt(p.p.m, 16), parseInt(p.p.p, 16), p.p.c, p.p.t, tiles);
        })).then(completed => {
            vars.boards.set(board.guildID, board);
            vars.players.set(board.guildID, completed);
            board.start(completed);
        });
        //console.log(JSON.stringify(saveObject, null, 2));
        //board.start(saveObject.p);
    }

    /**
     * Paints the board and the players
     * @returns {Promise<Discord.Attachment>}
     */
    async paint() {
        //Global variables for the current state of everything
        const vars = require('../../globalvariables');

        //Create a canvas with a size of 750x750
        const canvas = Canvas.createCanvas(750, 750);

        //Get a context from that canvas
        const ctx = canvas.getContext('2d');

        //Load the board image as an image and draw it
        const board = await Canvas.loadImage('./src/img/Monopoly board.png');
        ctx.drawImage(board, 0, 0, canvas.width, canvas.height);

        //Draw the houses
        //Filter the array to tiles with houses on them
        let tilesWithHouses = this.tiles.filter(tile => tile.amountHouses > 0 && tile.amountHouses !== 5);

        //For each tile, paint the appropriate number of houses, on the right coordinates
        tilesWithHouses.forEach(tile => {
            //Index of the tile
            let indexOfTile = tile.getIndex(this.tiles);

            //Offset variable for easy changing
            let offset = 3;

            //Depending on the row, one value never changes. This is the top variable in each if-statement
            //First row
            if (indexOfTile < 10) {
                let y = 660;
                let x = 595 - 61 * (indexOfTile - 1);

                //Negate a weird offset after a certain point
                if (indexOfTile % 10 > 5)
                    x -= offset;

                for (let i = 0; i <= tile.amountHouses; i++) {
                    if (tile.amountHouses === 1 && i === 1) continue;
                    if (i === 2) continue;

                    //Black outline
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x + 11 * i, y, 9, 9);
                    //Light green inside
                    ctx.fillStyle = '#B5E61D';
                    ctx.fillRect(x + 11 * i + 1, y + 1, 7, 7);

                }
                //Second row
            } else if (indexOfTile > 10 && indexOfTile < 20) {
                let x = 82;
                let y = 595 - 61 * (indexOfTile % 10 - 1);

                //Negate a weird offset after a certain point
                if (indexOfTile % 10 > 5)
                    y -= offset;

                for (let i = 0; i <= tile.amountHouses; i++) {
                    if (tile.amountHouses === 1 && i === 1) continue;
                    if (i === 2) continue;

                    //Black outline
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x, y + 11 * i, 9, 9);
                    //Light green inside
                    ctx.fillStyle = '#B5E61D';
                    ctx.fillRect(x + 1, y + 11 * i + 1, 7, 7);
                }
                //Third row
            } else if (indexOfTile > 20 && indexOfTile < 30) {
                let y = 82;
                let x = 103 + 61 * (indexOfTile % 10 - 1);

                //Negate a weird offset after a certain point
                if (indexOfTile % 10 > 5)
                    x += offset;

                for (let i = 0; i <= tile.amountHouses; i++) {
                    if (tile.amountHouses === 1 && i === 1) continue;
                    if (i === 2) continue;

                    //Black outline
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x + 11 * i, y, 9, 9);
                    //Light green inside
                    ctx.fillStyle = '#B5E61D';
                    ctx.fillRect(x + 11 * i + 1, y + 1, 7, 7);

                }
                //Fourth row
            } else {
                let x = 659;
                let y = 102 + 61 * (indexOfTile % 10 - 1);

                //Negate a weird offset after a certain point
                if (indexOfTile % 10 > 5)
                    y += offset;

                for (let i = 0; i <= tile.amountHouses; i++) {
                    if (tile.amountHouses === 1 && i === 1) continue;
                    if (i === 2) continue;

                    //Black outline
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(x, y + 11 * i, 9, 9);
                    //Light green inside
                    ctx.fillStyle = '#B5E61D';
                    ctx.fillRect(x + 1, y + 11 * i + 1, 7, 7);
                }
            }
        });

        //Draw the hotels
        //Filter the array to tiles with hotels on them
        let tilesWithHotels = this.tiles.filter(tile => tile.amountHouses === 5);

        //For each tile, paint the hotel on the right coordinates
        tilesWithHotels.forEach(tile => {
            //Index of the tile
            let indexOfTile = tile.getIndex(this.tiles);
            if (indexOfTile < 10) {
                let y = 660;
                let x = 597 - 61 * (indexOfTile - 1);

                //Black outline
                ctx.fillStyle = '#000000';
                ctx.fillRect(x, y, 18, 9);
                //Light green inside
                ctx.fillStyle = '#F25E65';
                ctx.fillRect(x + 1, y + 1, 16, 7);
            } else if (indexOfTile > 10 && indexOfTile < 20) {
                let x = 82;
                let y = 597 - 61 * (indexOfTile % 10 - 1);

                //Black outline
                ctx.fillStyle = '#000000';
                ctx.fillRect(x, y, 9, 18);
                //Light green inside
                ctx.fillStyle = '#F25E65';
                ctx.fillRect(x + 1, y + 1, 7, 16);
            } else if (indexOfTile > 20 && indexOfTile < 30) {
                let y = 82;
                let x = 136 + 61 * (indexOfTile % 10 - 1);

                //Black outline
                ctx.fillStyle = '#000000';
                ctx.fillRect(x, y, 18, 9);
                //Light green inside
                ctx.fillStyle = '#F25E65';
                ctx.fillRect(x + 1, y + 1, 16, 7);
            } else {
                let x = 659;
                let y = 136 + 61 * (indexOfTile % 10 - 1);

                //Black outline
                ctx.fillStyle = '#000000';
                ctx.fillRect(x, y, 9, 18);
                //Light green inside
                ctx.fillStyle = '#F25E65';
                ctx.fillRect(x + 1, y + 1, 7, 16);
            }
        });

        //Save the current state of the context for easy resetting
        ctx.save();

        //Variable of players
        const players = vars.players.get(this.guildID);

        //For each player, get their coordinates and draw them accordingly
        players.forEach(player => {
            //Get the coordinates based on the current position
            let coords = this.playerCoords(player);

            //Set the context to the coordinates so the image can be rotated correctly
            ctx.translate(coords[0], coords[1]);
            if (player.currentPosition > 9 && player.currentPosition <= 19)
                //Rotate 90°
                ctx.rotate(Math.PI / 2);
            else if (player.currentPosition > 19 && player.currentPosition <= 29)
                //Rotate 180°
                ctx.rotate(Math.PI);
            else if (player.currentPosition > 29 && player.currentPosition <= 39)
                //Rotate 270°
                ctx.rotate(Math.PI / 2 * 3);
            else
                ctx.rotate(0);

            //Set the context back to what it was
            ctx.translate(-coords[0], -coords[1]);

            //Draw the image
            ctx.drawImage(player.imgIcon, coords[0], coords[1], 40, 40);

            //Restore any transformations to the ctx.save() state
            ctx.restore();
        });

        //Make a new attachment from the buffer of this canvas
        let attachment = new Discord.Attachment(canvas.toBuffer(), 'board.png');

        //Return the image attachment
        return attachment;
    }

    /**
     * Returns the coordinates as to where to draw the player
     * @param {Player} player The player to check the coordinates for
     * @returns {Array<Number>}
     */
    playerCoords(player) {
        let x = 0,
            y = 0;
        //ALL HARDCODED VALUES
        if (player.currentPosition >= 0 && player.currentPosition <= 9) {
            y = 690;
            x = 660 - 61 * player.currentPosition;
        } else if (player.currentPosition > 9 && player.currentPosition <= 19) {
            x = 60;
            y = 660 - 61 * (player.currentPosition % 10);
        } else if (player.currentPosition > 19 && player.currentPosition <= 29) {
            y = 60;
            x = 90 + 61 * (player.currentPosition % 10);
        } else {
            x = 690;
            y = 80 + 61 * (player.currentPosition % 10);
        }
        return [x, y];
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
    if(!matches) throw new Error('No matching locales found');
    //console.log(matches);
    return Locales.getLocale(matches[1], matches[2]);
}