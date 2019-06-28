module.exports = {
    name: 'save',
    description: 'Gives you the save string in a nice code block for easy copying',
    run(message, args) {
        const vars = require('../globalvariables');
        return message.channel.send(`\`\`\`${vars.boards.get(message.guild.id).saveGame()}\`\`\``);
    }
}