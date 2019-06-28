module.exports = {
    name: 'properties',
    description: 'Tells you the properties you currently have',
    run(message, args) {
        const vars = require('../globalvariables');

        let players = vars.players.get(message.guild.id);

        let thisPlayer = players.find(player => player.id === message.author.id);
        if(!thisPlayer)
            return message.channel.send(`You're not participating in this game ${message.author}`);
        else {
            let tempString = '';
            thisPlayer.properties.forEach(tile => tempString += `\`${tile.name}\`, `);
            return message.channel.send(`You currently have the properties ${tempString}. ${message.author}`);
        }
    }
}