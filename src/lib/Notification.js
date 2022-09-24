const TelegramBot = require('node-telegram-bot-api');

class Notification {
  constructor(botToken, chatId) {
    this.botToken = botToken;
    this.chatId = chatId;

    this.instance = new TelegramBot(this.botToken, { polling: false });
  }

  send(msg) {
    return this.instance.sendMessage(this.chatId, msg, { parse_mode: 'HTML' });
  }

  sendSilent(msg) {
    return this.instance.sendMessage(this.chatId, msg, { parse_mode: 'HTML', disable_notification: true });
  }
}

module.exports = Notification;
