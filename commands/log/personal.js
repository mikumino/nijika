const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const QuickChart = require('quickchart-js');
const { Op } = require('sequelize');
const Log = require('../../models/Log');
const Source = require('../../models/Source');
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
                    // { name: 'Yearly', value: 'yearly' },    // by month
                )),
    async execute(interaction) {
        function getDateRange(range) {
            let startDate;
            let endDate = new Date();   // today

            switch (range) {
                case 'weekly':
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - startDate.getDay());
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'monthly':
                    startDate = new Date();
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                case 'yearly':  // not implemented yet
                    startDate = new Date();
                    startDate.setMonth(0);
                    startDate.setDate(1);
                    startDate.setHours(0, 0, 0, 0);
                    break;
                default:
                    throw new Error('Invalid range');
            }

            return { startDate, endDate };
        }

        async function getLogs(userId, range) {
            const { startDate, endDate } = getDateRange(range);

            const logs = await Log.findAll({
                include: [{     // i keep learning new things 😀
                    model: Source,
                    attributes: ['sourceType']
                }],
                where: {
                    userId: userId,
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            });

            return logs;
        }

        function cleanLogs(logs, range) {
            const { startDate, endDate } = getDateRange(range);
                      
            let labels = [];
            let data = [];

            // fill labels with dates from startDate to endDate
            let date = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
            while (date < endDate.toISOString().split('T')[0]) {
                labels.push(date);
                date = new Date(new Date(date).getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0];
            }

            // define colors for each sourceType
            const colors = {
                'Book': {
                    borderColor: 'rgba(0, 102, 204, 1)', // Dark blue border
                    backgroundColor: 'rgba(0, 102, 204, 0.5)', // Lighter blue inner color
                    borderWidth: 1
                  },
                  'Anime': {
                    borderColor: 'rgba(255, 102, 0, 1)', // Orange border
                    backgroundColor: 'rgba(255, 102, 0, 0.5)', // Lighter orange inner color
                    borderWidth: 1
                  },
                  'Manga': {
                    borderColor: 'rgba(51, 204, 51, 1)', // Green border
                    backgroundColor: 'rgba(51, 204, 51, 0.5)', // Lighter green inner color
                    borderWidth: 1
                  },
                  'Visual Novel': {
                    borderColor: 'rgba(255, 153, 0, 1)', // Gold border
                    backgroundColor: 'rgba(255, 153, 0, 0.5)', // Lighter gold inner color
                    borderWidth: 1
                  },
                  'Video Game': {
                    borderColor: 'rgba(153, 51, 255, 1)', // Purple border
                    backgroundColor: 'rgba(153, 51, 255, 0.5)', // Lighter purple inner color
                    borderWidth: 1
                  },
                  'Reading': {
                    borderColor: 'rgba(204, 0, 0, 1)', // Red border
                    backgroundColor: 'rgba(204, 0, 0, 0.5)', // Lighter red inner color
                    borderWidth: 1
                  },
                  'Listening': {
                    borderColor: 'rgba(0, 153, 153, 1)', // Teal border
                    backgroundColor: 'rgba(0, 153, 153, 0.5)', // Lighter teal inner color
                    borderWidth: 1
                  },
                  'Other': {
                    borderColor: 'rgba(128, 128, 128, 1)', // Gray border
                    backgroundColor: 'rgba(128, 128, 128, 0.5)', // Lighter gray inner color
                    borderWidth: 1
                  }

            }

            logs.forEach(log => {
                let date = new Date(log.createdAt.getTime() - (log.createdAt.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                
                if (!data[log.Source.sourceType]) {
                    data[log.Source.sourceType] = {
                        backgroundColor: colors[log.Source.sourceType].backgroundColor,
                        borderColor: colors[log.Source.sourceType].borderColor,
                        borderWidth: colors[log.Source.sourceType].borderWidth,
                        data: Array(labels.length).fill(0)
                    };
                }
                data[log.Source.sourceType].data[labels.indexOf(date)] += log.duration / 60.0;  // exists, add duration
            });

            data = Object.keys(data).map(sourceType => {
                return {
                    label: sourceType,
                    data: data[sourceType].data,
                    backgroundColor: data[sourceType].backgroundColor,
                    borderColor: data[sourceType].borderColor,
                    borderWidth: data[sourceType].borderWidth
                }
            });

            return { labels, data };
        }

        async function generateChart(labels, data, range) {
            const chart = new QuickChart();
            chart.setDevicePixelRatio(4.0); // too much? lol
            chart.setConfig({
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: data
                },
                options: {
                    scales: {
                        xAxes: [{
                            stacked: true,
                            offset: true,
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM DD'
                                }       
                            }   
                        }],
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true,
                                callback: function (value) {
                                    return value + 'h';
                                }
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: `${interaction.user.username}'s ${range} overview`,
                    }
                }
            });
            
            // Saves chart image to disk
            // Sending a URL works but since QuickChart URLs can get pretty long, it's better to just send the image
            // Short QuickChart URLs also expire after a while
            await chart.toFile(__dirname + '/chart.png');
            return;
        }

        try {
            const range = interaction.options.getString('range') || 'monthly';
            const logs = await getLogs(interaction.user.id, range);
            const { labels, data } = cleanLogs(logs, range);
            await generateChart(labels, data, range);
            const image = new AttachmentBuilder(__dirname + '/chart.png');
            
            await interaction.reply({  files: [image] });

            fs.unlinkSync(__dirname + '/chart.png');
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}