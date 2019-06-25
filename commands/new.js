const vars = require('../globalvariables');
const Message = require('discord.js/src/structures/Message');
const Board = require('../src/classes/Board');
const Player = require('../src/classes/Player');

const Canvas = require('canvas');
const snekfetch = require('snekfetch');

module.exports = {
    name: 'new',
    /**
     * The message and argument parameters from index.js
     * @param {Message} message 
     * @param {Array<String>} args 
     */
    run(message, args) {
        //Check if a game is already in progress
        if (vars.boards.get(message.guild.id) && vars.boards.get(message.guild.id).isInProgress) {
            //If it is, require verification from one other player so it was decided the game was over.
            message.channel.send(`You want to start a new game, but a game is already in progress. This command requires verification from one other player`).then(msg => {
                msg.react('✅');

                //The filter for which to listen to: the specific emoji and the players who were playing.
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && vars.players.get(message.guild.id).find(player => player.id === user.id);
                }

                //5 seconds to decide
                const collector = msg.createReactionCollector(filter, {
                    time: 5000
                });

                //If it was succesfull, start a new game, otherwise continue
                collector.on('end', collected => {
                    console.log('collector ended');
                    collected = collected.first().users.filter(user => user.id !== message.client.user.id);
                    if (collected.length <= 1) return message.channel.send(`Not enough players agreed. Continuing game...`);
                    else newBoard(message, args);
                });
            });
        } else {
            //If a game isn't in progress, start a new game
            newBoard(message, args);
        }
    }
}

/**
 * A function to initiliaze a board, put here so there's no duplicate code
 * @param {Message} message 
 * @param {Array<String>} args 
 */
function newBoard(message, args) {
    //If there are no arguments for the constructor of the Board, default to 'us-default'
    if(!args[0]) {
        console.log('no args provided, defaulting to us-default');
        args[0] = 'us-default';
    }

    //Create the board and set it to the global variables
    const board = new Board(message.guild.id, `${args[0]}`);
    vars.boards.set(message.guild.id, board);

    /**
     * An array of players
     * @type {Array<Player>}
     */
    var arr = [];

    //Easy way for people to participate; look for the emoji and allow up to 6 people to play. It can be higher, but then you can't really play. 
    message.channel.send(`You're about to start a new game of monopoly, everyone who wants to participate please react to this message (Max 6 people)`).then(msg => {
        msg.react('✅');
        const filter = reaction => '✅' === reaction.emoji.name;

        //15 seconds with a max number of people being 6
        const collector = msg.createReactionCollector(filter, {
            time: 15000,
            maxUsers: 6
        });

        collector.on('collect', (reaction, reactionCollector) => {
            if (reactionCollector.collected.length === 6)
                collector.stop();
        });

        collector.on('end', collected => {
            //Once it has ended, save all the users in a collection
            let users = collected.first().users;

            //Wait for all the promises to get resolved
            Promise.all(users.map(async user => {
                const {
                    body: buffer
                } = await snekfetch.get(user.displayAvatarURL);
                const avatar = await Canvas.loadImage(buffer);
                return new Player(board, user.id, user.tag, avatar);
                //console.log(arr);
            })).then(completed => {
                //filter out the bot from the reactions, if the player count is bigger than 2 (If there's another player)
                if(completed.length > 2)
                    completed = completed.filter(player => player.id !== message.client.user.id);

                //Push the players into the player array
                completed.forEach(value => arr.push(value));

                //Set the players into the global variables
                vars.players.set(message.guild.id, arr);

                //A temporary string to add all the player names to
                let tempString = "";
                vars.players.get(message.guild.id).forEach(player => tempString += `${player.name}, `);

                //If the guild doesn't have a channel set, set the channel to the current one
                if(vars.channels.get(message.guild.id)) {
                    vars.channels.get(message.guild.id).send(`The users ${tempString} joined. Time to start!`);
                } else {
                    vars.channels.set(message.guild.id, message.channel);
                    vars.channels.get(message.guild.id).send(`The users ${tempString} joined. Time to start!`);
                }
                board.start();
            });

        });
    });
}