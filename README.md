# Mukou - Immersion Tracking Discord Bot

Log immersion, get experience points, level up, and share your immersion progress with friends.

## 📃 Requirements

---

1. Discord Bot Token ([guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot))
2. Node.js (tested on v18.13.0+)

## 💾 Installation

---

Run the following:

```python
git clone https://github.com/mikumino/mukou.git
cd mukou
npm install
```

Then make a config.json with:

```python
{
    "token": "YOUR BOT TOKEN HERE",
    "clientId": "YOUR BOT CLIENT ID HERE",
}
```

You can then start the bot with:

```python
node index.js
```

## 🎊 Features

---

- Immersion tracking with /log
    - Create Sources: Media sources you can repetitively log
    - Log one-time media
    - Gain XP from tracking, compete with friends

![Preview](https://media.discordapp.net/attachments/860052392715616266/1128426070518009977/immersionbotpreview.png?width=1149&height=665)