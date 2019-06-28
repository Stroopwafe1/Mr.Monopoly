const Discord = require('discord.js');
const Player = require('./src/classes/Player');
const Board = require('./src/classes/Board');

const events = require('events');
const eventEmitter = new events.EventEmitter();

/**
 * The collection of monopoly channels, mapped by the guild ID
 * @type {Map<Snowflake, TextChannel>}
 */
var channels = new Discord.Collection();

/**
 * A collection of String arrays, mapped by the guild ID
 * @type {Map<Snowflake, Array<String>>}
 */
var messages = new Discord.Collection();

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
    channels,
    messages,
    players,
    boards,
    eventEmitter
}