const { Events } = require('discord.js');
const { ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
        client.user.setActivity({
            name: 'LIVE @ STARRY',
            type: ActivityType.Playing,
        });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};