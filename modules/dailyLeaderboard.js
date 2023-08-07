const cron = require('node-cron');

let cronJob;

async function start(channel) {
    cronJob = cron.schedule('*/10 * * * * *', () => {
        console.log('Sending daily message.');
        channel.send('AAAAAAAAAHHHHH HELP ME'); // temp message
        // TODO: Make this send the actual daily leaderboard
    });
}

function stop() {
    cronJob.stop();
}

module.exports = { start, stop };