const TelegramBot = require('node-telegram-bot-api');
const { getToday, getCurrentWeekNumber, getStartDate, getElementsFromMomentDate } = require('../helpers');

class Notification {
  constructor(botToken, chatId, settings, schedule) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.settings = settings;
    this.schedule = schedule;

    this.instance = new TelegramBot(this.botToken, { polling: true });

    // Matches "/help"
    this.instance.onText(/^(\/help)$/, (msg, _match) => {
      const chatId = msg.chat.id;

      const html = `<b>/today</b> - Get today schedule`;

      if (chatId === this.chatId) {
        this.instance.sendMessage(chatId, html, {
          parse_mode: 'HTML',
        });
      }
    });

    // Matches "/today"
    this.instance.onText(/^(\/today)$/, (msg, _match) => {
      const chatId = msg.chat.id;

      // get today
      const { timezone } = this.settings;
      const startDate = getStartDate(timezone);
      const today = getToday(timezone);

      const weekNumber = getCurrentWeekNumber(startDate, today);

      const todayDateElements = getElementsFromMomentDate(today);

      const todaySchedule = this.schedule[todayDateElements.day].filter(lecture => lecture.week === weekNumber);

      const html = `
<b>Today Schedule:</b>

<pre><code>${JSON.stringify(todaySchedule, null, 2)}</code></pre>
`;

      if (chatId === this.chatId) {
        this.instance.sendMessage(chatId, html, {
          parse_mode: 'HTML',
        });
      }
    });
  }

  send(msg) {
    return this.instance.sendMessage(this.chatId, msg, { parse_mode: 'HTML' });
  }

  sendSilent(msg) {
    return this.instance.sendMessage(this.chatId, msg, { parse_mode: 'HTML', disable_notification: true });
  }
}

module.exports = Notification;
