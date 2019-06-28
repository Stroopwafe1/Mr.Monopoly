const vars = require('../globalvariables');

module.exports = {
    name: 'channel',
    description: 'Sets the monopoly channel to a specific one. HIGHLY RECOMMENDED YOU USE A SEPARATE CHANNEL. IT WILL CLUTTER',
    run(message, args) {
        vars.channels.set(message.guild.id, message.channel);
        return vars.channels.get(message.guild.id).send(`Monopoly channel set to ${message.channel}`);
    }
}