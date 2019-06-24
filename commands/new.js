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
        if (vars.boards.get(message.guild.id) && vars.boards.get(message.guild.id).isInProgress) {
            message.channel.send(`You want to start a new game, but a game is already in progress. This command requires verification from one other player`).then(msg => {
                msg.react('✅');
                const filter = (reaction, user) => {
                    return reaction.emoji.name === '✅' && vars.players.get(message.guild.id).find(player => player.id === user.id);
                }

                const collector = msg.createReactionCollector(filter, {
                    time: 5000
                });

                collector.on('end', collected => {
                    console.log('collector ended');
                    collected = collected.first().users.filter(user => user.id !== message.client.user.id);
                    if (collected.length <= 1) return message.channel.send(`Not enough players agreed. Continuing game...`);
                    else newBoard(message, args);
                });
            });
        } else {
            newBoard(message, args);
        }
    }
}

function newBoard(message, args) {
    console.log('new board made');
    const board = new Board(`${args[0]}`);
    vars.boards.set(message.guild.id, board);
    /**
     * An array of players
     * @type {Array<Player>}
     */
    var arr = [];
    message.channel.send(`You're about to start a new game of monopoly, everyone who wants to participate please react to this message (Max 6 people)`).then(msg => {
        msg.react('✅');
        const filter = reaction => '✅' === reaction.emoji.name;
        const collector = msg.createReactionCollector(filter, {
            time: 15000,
            maxUsers: 6
        });

        collector.on('collect', (reaction, reactionCollector) => {
            if (reactionCollector.collected.length === 6)
                collector.stop();
        });

        collector.on('end', collected => {
            let users = collected.first().users;
            Promise.all(users.map(async user => {
                const {
                    body: buffer
                } = await snekfetch.get(user.displayAvatarURL);
                const avatar = await Canvas.loadImage(buffer);
                return new Player(board, user.id, user.tag, avatar);
                //console.log(arr);
            })).then(completed => {
                completed = completed.filter(player => player.id !== message.client.user.id);
                completed.forEach(value => arr.push(value));
                vars.players.set(message.guild.id, arr);
                console.log(vars.players.get(message.guild.id));
            });

        });
    });
}