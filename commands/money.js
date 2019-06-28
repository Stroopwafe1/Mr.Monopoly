
module.exports = {
    name: 'money',
    description: 'Tells you your current amount of money in the game',
    run(message, args) {
        const vars = require('../globalvariables');

        let players = vars.players.get(message.guild.id);

        let thisPlayer = players.find(player => player.id === message.author.id);
        if(!thisPlayer)
            return message.channel.send(`You're not participating in this game ${message.author}`);
        else {
            return message.channel.send(`You currently have ${thisPlayer.money} ${message.author}`);
        }
    }
}