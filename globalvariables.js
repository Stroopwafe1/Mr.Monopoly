const Discord = require('discord.js');
const Player = require('./src/classes/Player');
const Board = require('./src/classes/Board');

/**
 * A collection of the players, mapped by the guild ID
 * @type {Map<Snowflake, Array<Player>>}
 */
var players = new Discord.Collection();

/**
 * A collection of the boards active, mapped by the guild ID
 * @type {Map<Snowflake, Board>} 
 */
var boards = new Discord.Collection();

module.exports = {
    players,
    boards
}