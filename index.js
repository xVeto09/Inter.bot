const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] }, {partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const config = require('./config')
const token = config.token
const prefix = config.prefix

client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.once('ready', () => 
{
    console.log(`Bot Working! ${client.user.tag}`);

    client.user.setActivity('Jestem Botem!');
})

client.on('messageCreate', message => 
{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLocaleLowerCase();

    if(!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('ta komenda nie działa');
    }
});

client.login(token);