const cron = require('node-cron');
const createLeaderboard = require('./createLeaderboard');
const images = require('./images.json');

let cronJob;

async function start(channel) {
    cronJob = cron.schedule('0 2 * * *', async () => {
        try {
            const randomImage = images.rest[Math.floor(Math.random() * images.rest.length)];
            console.log('Sending daily message.');
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setDate(endDate.getDate() - 1);
            endDate.setHours(23, 59, 59, 999);
            const embed = await createLeaderboard.create(channel, startDate, endDate);
            embed.setTitle(`${channel.guild.name}'s Daily Summary 🕙`);
            embed.setImage(randomImage);
            channel.send({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            channel.send("AAAAAAAAAAAAAAAAH");
        }
    });
}

function stop() {
    cronJob.stop();
}

async function forceSend(channel) {
    const randomImage = images.rest[Math.floor(Math.random() * images.rest.length)];
    console.log(randomImage);
    console.log('Sending daily message.');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);
    const embed = await createLeaderboard.create(channel, startDate, endDate);
    embed.setTitle(`${channel.guild.name}'s Daily Summary 🕙`);
    await embed.setImage(randomImage);  // I DONT GET IT
    channel.send({ embeds: [embed] });
}

module.exports = { start, stop, forceSend };