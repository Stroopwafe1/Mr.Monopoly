const vars = require('../globalvariables');

module.exports = {
    name: 'channel',
    run(message, args) {
        vars.channels.set(message.guild.id, message.channel);
        return vars.channels.get(message.guild.id).send(`Monopoly channel set to ${message.channel}`);
    }
}