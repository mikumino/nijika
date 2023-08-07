const cron = require('node-cron');
const createLeaderboard = require('./createLeaderboard');

let cronJob;

async function start(channel) {
    cronJob = cron.schedule('0 2 * * *', async () => {
        try {
            console.log('Sending daily message.');
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            const embed = await createLeaderboard.create(channel, startDate, endDate);
            embed.setTitle(`${channel.guild.name}'s Daily Summary 🕙`);
            embed.setImage('https://cdn.discordapp.com/attachments/1134330884535894208/1137944989981225010/DKB_Bocchi_the_Rock_-_S01E04_1080pHEVC_x265_10bitMulti-Subs__00_22_03.574__0001_Medium.jpg');
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

module.exports = { start, stop };