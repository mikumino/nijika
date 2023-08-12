const { SlashCommandBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const Log = require('../../models/Log');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personal')
        .setDescription('Get charts of logs with various filters')
        .addStringOption(option =>
            option
                .setName('range')
                .setDescription('Time range to filter logs (default: monthly)')
                .setRequired(false) // monthly is default
                .addChoices(
                    { name: 'Weekly', value: 'weekly' },    // by day
                    { name: 'Monthly', value: 'monthly' },  // by day
                    { name: 'Yearly', value: 'yearly' },    // by month
                )),
    async execute(interaction) {
        // function to create chart, maybe in separate file later
        const createChart = (logs, range) => {
            const chart = new QuickChart();
            chart.setConfig({
                type: 'bar',
                data: {
                    labels: logs.map(log => log.date),
                    datasets: [{
                        label: 'Hours',
                        data: logs.map(log => log.totalDuration),
                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            offset: true,
                            type: 'time',
                            time: {
                                // by day if weekly or monthly, by month if yearly
                                unit: range === 'yearly' ? 'month' : 'day',
                                displayFormats: {
                                    day: 'MMM D',
                                }
                            },
                            ticks: {
                                beginAtZero: true,
                            },
                            
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                                callback: function(value) {
                                    return value + 'h';
                                }
                            }
                        }]
                    }
                }
            });

            // get image
            const chartUrl = chart.getUrl();
            return chartUrl;
        }
        
        const range = interaction.options.getString('range') || 'monthly';

        // get logs
        switch (range) {
            case 'weekly':
                // get logs for past 7 days
                break;
            case 'monthly':
                // get first day of month
                const firstDay = new Date();
                firstDay.setDate(1);
                firstDay.setHours(0, 0, 0, 0);  // unnecessary?
                // get logs for the month so far
                const monthlyLogs = await Log.findAll({
                    attributes: [
                        // Truncate createdAt to date only, no time
                        [sequelize.fn('strftime', '%Y-%m-%d', sequelize.fn('datetime', sequelize.col('createdAt'), 'localtime')), 'date'],
                        // Sum duration and divide by 60 to get hours
                        [sequelize.fn('sum', sequelize.literal('duration / 60.0')), 'totalDuration'],
                    ],
                    where: {
                        userId: interaction.user.id,
                        createdAt: {
                            [Op.gte]: firstDay
                        }
                    },
                    group: ['date'],
                    raw: true,
                });
                console.log(monthlyLogs);
                // create chart
                const url = createChart(monthlyLogs, range);
                // send image
                await interaction.reply(`${url}`);
            case 'yearly':
                // get logs for past 12 months
                break;
        }
    }
}