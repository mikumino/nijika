const cron = require('node-cron');
const createLeaderboard = require('./createLeaderboard');
const images = require('./images.json');

let dailyJob, monthlyJob;

async function start(channel) {
    // daily job
    dailyJob = cron.schedule('0 2 * * *', async () => {
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
    // monthly job
    monthlyJob = cron.schedule('0 2 1 * *', async () => {
        try {
            const randomImage = images.rest[Math.floor(Math.random() * images.rest.length)];
            console.log('Sending monthly message.');
            const now = new Date();
            const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(now.getFullYear(), now.getMonth(), 0); 
            endDate.setHours(23, 59, 59, 999);
            const embed = await createLeaderboard.create(channel, startDate, endDate);
            embed.setTitle(`${channel.guild.name}'s Monthly Summary 📅`);
            embed.setImage(randomImage);
            channel.send({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            channel.send("AAAAAAAAAAAAAAAAH");
        }
    });
}

function stop() {
    dailyJob.stop();
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