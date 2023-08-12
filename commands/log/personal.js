const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const Log = require('../../models/Log');
const fs = require('node:fs');

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
        const createChart = async (logs, range) => {
            const chart = new QuickChart();
            chart.setConfig({
                type: 'bar',
                data: {
                    labels: logs.map(log => log.date),
                    datasets: [{
                        label: 'Hours',
                        data: logs.map(log => log.totalDuration),
                        borderColor: 'rgba(250, 117, 107)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(250, 117, 107, 0.5)',
                    }],
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
                                min: new Date().setDate(0),
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
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: `${interaction.user.username}'s ${range} overview`,
                    },
                    layout: {
                        padding: 10,
                    },
                }
            });

            // Saves chart image to disk
            // Sending a URL works but since QuickChart URLs can get pretty long, it's better to just send the image
            // Short QuickChart URLs also expire after a while
            await chart.toFile(__dirname + '/chart.png');
            return;
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
                        // Done to group by date
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
                    raw: true,  // Plain objects so we can use more easily
                });

                await createChart(monthlyLogs, range);
                const image = new AttachmentBuilder(__dirname + '/chart.png');
                await interaction.reply( { files: [image] });

                // Deletes chart image from disk
                fs.unlinkSync(__dirname + '/chart.png');
            case 'yearly':
                // get logs for past 12 months
                break;
        }
    }
}