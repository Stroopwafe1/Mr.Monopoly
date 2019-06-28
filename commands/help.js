module.exports = {
    name: 'help',
    description: 'Shows the help',
    run(message, args) {
        const { commands } = message.client;

        return message.channel.send(commands.map(command => {
            return `m!${command.name}: ${command.description}`;
        }).join('\n'), { code: 'CSS' });

    }
}