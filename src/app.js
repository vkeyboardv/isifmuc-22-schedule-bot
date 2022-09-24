const moment = require('moment-timezone');

const getMomentDuration = (momentStartDate, momentEndDate) => moment.duration(momentEndDate.diff(momentStartDate));

const getCurrentWeekNumber = (momentStartDate, momentEndDate) => {
  const diffDays = getMomentDuration(momentStartDate, momentEndDate).asDays();
  const rest = Math.trunc(diffDays / 7);

  return rest % 2 === 0 ? 1 : 2;
};

const getElementsFromMomentDate = momentsDate => {
  const minute = momentsDate.minute();
  const hour = momentsDate.hour();
  const day = momentsDate.day();
  const date = momentsDate.date();
  const month = momentsDate.month();
  const year = momentsDate.year();

  return { minute, hour, day, date, month, year };
};

const generateNotificationMessage = ({ subject, timeStart, auditorium, type, lecturer, details }) => {
  const html = `⏰ <b>${subject}</b> starting in 5 minutes (${timeStart})

Auditorium: ${auditorium}
Type: ${type}
Lecturer: ${lecturer}
${details ? `Details: ${details}` : ''}
`;

  return html;
};

const start = async ({ notification, settings, schedule }) => {
  try {
    const { timezone } = settings;
    const mondayFirstWeek = new Date('9/12/2022');

    const startDate = moment(mondayFirstWeek).tz(timezone);
    const today = moment().tz(timezone);

    const weekNumber = getCurrentWeekNumber(startDate, today);

    const todayDateElements = getElementsFromMomentDate(today);
    const todaySchedule = schedule[todayDateElements.day].filter(lecture => lecture.week === weekNumber);

    for (const schedule of todaySchedule) {
      const [hour, minute] = schedule.timeStart.split(':');

      const lectureDate = moment()
        .tz(timezone)
        .set({
          hour,
          minute,
          date: todayDateElements.date,
          month: todayDateElements.month,
          year: todayDateElements.year,
        })
        .subtract(settings.beforeMinutes, 'minutes');

      const timeout = getMomentDuration(today, lectureDate).asMilliseconds();

      setTimeout(() => {
        const msg = generateNotificationMessage(schedule);

        notification.send(msg);
      }, timeout);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { start };
