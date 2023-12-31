const fs = require('node:fs')
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, autoLeaderboard, logChannelId } = require('./config.json');
const sequelize = require('./database');
const User = require('./models/User'); // idk if these are where they should be but they work
const Source = require('./models/Source');
const Log = require('./models/Log');
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = client;

// Sync database
(async () => {
    try {
        await sequelize.sync();
        //await sequelize.sync({ alter: true, force: true }); // WARNING: This will drop all tables and recreate them
        console.log('Database synced.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
})();

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// log in
client.login(token);

// start auto leaderboard
client.once(Events.ClientReady, async () => {
    if (autoLeaderboard && logChannelId !== "") {
        const channel = await client.channels.fetch(logChannelId);
        require('./modules/autoLeaderboard').start(channel);
    }
});