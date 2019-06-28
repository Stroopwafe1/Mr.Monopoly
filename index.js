const {
    TOKEN
} = require('./SuperSecretTokenFile');

const Discord = require('discord.js');
const client = new Discord.Client();

//The prefix for the bot
const PREFIX = 'm!';

//A collection for all of the commands to be added to
client.commands = new Discord.Collection();

//FS for file searching the command files
const fs = require('fs');

//All the command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//And now setting all the command files into the command collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.login(TOKEN);

/**
 * Once the client is logged in and ready, log it
 */
client.on('ready', () => {
    client.user.setActivity('Monopoly');
    console.log(`Logged in as ${client.user.tag}`);
});

/**
 * Emitted upon joining a guild.
 * Suggest to add a dedicated channel as it will clutter
 */
client.on('guildCreate', guild => {
    guild.defaultChannel.send(`Thank you for adding me to your server!\nIf you haven't done so already, I suggest you make a seperate channel so everything stays organised\nYou can set the channel with the command \`m!channel\``);
});


// Check for a command on every message
client.on('message', message => {
    //If the author of the message is a bot or the channel isn't a text channel, ignore this all
    if (message.author.bot || !message.channel.type === 'text') return;

    //The variable for if the bots gets mentioned
    let botMention = message.mentions.users.find(user => user.id === client.user.id);

    //Global variables for easy access
    const vars = require('./globalvariables');
    //If the game has been instantiated, don't listen for a prefix/mention
    if (vars.boards.get(message.guild.id) && vars.boards.get(message.guild.id).isInProgress && !message.content.startsWith(PREFIX)) {
        
        //If the channel isn't the monopoly channel, ignore the message
        if (message.channel !== vars.channels.get(message.guild.id)) {
            return;
        }

        //If the player who sent the message isn't in the game, ignore the message
        if(!vars.players.get(message.guild.id).find(player => player.id === message.author.id))
            return;

        //If the player who sent the message isn't the one whose turn it is, ignore the message
        if (!vars.players.get(message.guild.id).find(player => player.id === message.author.id).isTurn) {
            return;
        }
        //Else, if that isn't the case, 'transfer' the command to the player command listener
        else {
            vars.eventEmitter.emit('message', message.content);
        }

    }

    //If the bot doesn't get mentioned, and the message doesn't start with a prefix, do nothing
    if (!botMention && !message.content.startsWith(PREFIX)) return;

    let arguments = [];
    let commandName = '';

    let input = '';
    if (!botMention)
        input = message.content.slice(PREFIX.length).trim();
    else
        input = message.content.slice(message.content.indexOf(botMention)).trim();
    if (!input) return;

    arguments = input.split(/ +/);
    commandName = arguments.shift();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    //If there's no command, do nothing
    if (!command) return;

    //Try to run the command
    try {
        command.run(message, arguments);
    } catch (error) {
        return message.channel.send(`${message.author}, the following error occurred:\n\`\`\`${error}\`\`\``);
    }
});