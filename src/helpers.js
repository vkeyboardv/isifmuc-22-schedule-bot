const moment = require('moment-timezone');

const getStartDate = tz => {
  const mondayFirstWeek = new Date('9/12/2022');

  return moment(mondayFirstWeek).tz(tz);
};

const getToday = tz => moment().tz(tz);

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

const generateNotificationMessage = ({ subject, timeStart, auditorium, type, lecturer, details }, beforeMinutes) => {
  const html = `⏰ <b>${subject}</b> starting in ${beforeMinutes} minutes (${timeStart})

Auditorium: ${auditorium}
Type: ${type}
Lecturer: ${lecturer}
${details ? `Details: ${details}` : ''}
`;

  return html;
};

module.exports = {
  getStartDate,
  getToday,
  getMomentDuration,
  getCurrentWeekNumber,
  getElementsFromMomentDate,
  generateNotificationMessage,
};
