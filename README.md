# Nijika - Immersion Tracking Discord Bot

A personal solution for my friend's server. Log immersion, get experience points, level up, and share your immersion progress with friends. Heavily inspired by TheMoeWay's immersion bot.

![Preview](https://cdn.discordapp.com/attachments/860052392715616266/1135459697760153630/Screenshot_210.png)

## 📃 Requirements

1. Discord Bot Token ([guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))
2. Node.js (tested on v18.13.0+)

## 💾 Installation

Run the following:

```
git clone https://github.com/mikumino/nijika.git
cd nijika
npm install
```

Fill appropriate fields in `example-config.json` and rename it to `config.json`. 

You can then start the bot with:

```
node index.js
```

## 🎊 Features

### 📖 Immersion tracking with /log
- Create Sources: Media sources you can repetitively log
- Log one-time media
- Gain XP from tracking, compete with friends

### 🏆 Leaderboard
- See rankings based on immersion time
- Sort by day, week, or month

![Preview](https://cdn.discordapp.com/attachments/860052392715616266/1141566261877297182/Screenshot_211.png)

### 📚 Daily Summaries
- See time and point breakdown for the day
- Automatic daily server-wide summaries with /toggledaily

![Preview](https://cdn.discordapp.com/attachments/860052392715616266/1135459698221518858/Screenshot_209.png)

### 📊 Statistics
- Generate graphs of your immersion time
- Organize by week or month

![Preview](https://cdn.discordapp.com/attachments/520407476441448478/1142681259437457508/chart.png)

### 🏃 Quick Logging
- Log media with a single command
- Autocompletes based on your sources

![Preview](https://cdn.discordapp.com/attachments/1125497331681341571/1141566889840095312/Screenshot_214.png)

### 📝 Sources
- See all your sources
- Add, remove, and edit sources

![Preview](https://cdn.discordapp.com/attachments/860052392715616266/1141566262154104942/Screenshot_212.png)

### ℹ️ Source Info
- See information about a source

![Preview](https://cdn.discordapp.com/attachments/860052392715616266/1141566262594515084/Screenshot_213.png)


