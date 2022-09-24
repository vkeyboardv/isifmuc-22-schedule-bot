const nconf = require('nconf');

nconf.env().argv().file('config.json');

const Notification = require('./lib/Notification');

const schedule = require('./schedule.json');

const { start } = require('./app');

const container = {
  notification: new Notification(nconf.get('tg:botToken'), nconf.get('tg:chatId')),
  settings: nconf.get('settings'),
  schedule,
};

const CronJob = require('cron').CronJob;

(async () => {
  try {
    const pattern = '0 1 * * *'; // every day at 01:00 (Kyiv)

    console.log(`[${new Date().toISOString()}]: Initializing a cron job - `, pattern);
    new CronJob(pattern, () => start(container), null, true, container.settings.timezone);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
