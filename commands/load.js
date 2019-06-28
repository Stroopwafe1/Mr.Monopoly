const Board = require('../src/classes/Board');

module.exports = {
    name: 'load',
    description: 'Loads the game from the save underneath the board. Be sure to remove [Save: ] beforehand',
    run(message, args) {
        const vars = require('../globalvariables');

        if(!vars.channels.get(message.guild.id))
            vars.channels.set(message.guild.id, message.channel);
        Board.loadGame(message.guild, args[0]);
    }
}