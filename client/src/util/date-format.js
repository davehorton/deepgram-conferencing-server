
const breakDownDate = (originalDate) => {
  const d = new Date(originalDate);
  let year = d.getFullYear();
  let mon = d.getMonth() + 1;
  let date = d.getDate();
  let hour = d.getHours();
  let min = d.getMinutes();
  let sec = d.getSeconds();
  let ampm = hour < 12 ? 'am' : 'pm';

  mon = mon.toString().padStart(2, 0);
  date = date.toString().padStart(2, 0);
  min = min.toString().padStart(2, 0);
  sec = sec.toString().padStart(2, 0);

  hour = hour === 0
    ? 12
    : hour > 12
      ? hour - 12
      : hour

  return { year, mon, date, hour, min, sec, ampm }
};

const datetime = (date) => {
  if (!date) return false;
  const d = breakDownDate(date);
  return `${d.year}-${d.mon}-${d.date} ${d.hour}:${d.min}${d.ampm}`
};

const timeOnly = (date) => {
  if (!date) return false;
  const d = breakDownDate(date);
  return `${d.hour}:${d.min}${d.ampm}`
};

const dateOnly = (date) => {
  if (!date) return false;
  const d = breakDownDate(date);
  return `${d.year}-${d.mon}-${d.date}`
};

const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const d1obj = breakDownDate(d1);
  const d2obj = breakDownDate(d2);
  if (
    (d1obj.year === d2obj.year) &&
    (d1obj.mon === d2obj.mon) &&
    (d1obj.date === d2obj.date)
  ) {
    return true;
  } else {
    return false;
  }
};

const timeDifference = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const milliseconds = Math.abs(d1 - d2);
  const seconds = Math.round(milliseconds / 1000);
  return seconds;
};

const formatTimeDuration = (durationInSeconds, numberDecimals) => {
  if (parseFloat(durationInSeconds) === 0) {
    return `${(0).toFixed(numberDecimals)}s`;
  }
  if (!durationInSeconds) return false;
  let days = Math.floor(durationInSeconds / 86400);
  let secAfterDays = durationInSeconds % 86400;
  let hours = Math.floor(secAfterDays / 3600);
  let secAfterHours = secAfterDays % 3600;
  let min = Math.floor(secAfterHours / 60);
  let sec = (secAfterHours % 60).toFixed(numberDecimals);
  if (parseFloat(sec) === 60) {
    min += 1;
    sec = 0;
  }
  return `` +
    `${days ? `${days}d ` : ''}` +
    `${hours ? `${hours}h ` : ''}` +
    `${min ? `${min}m ` : ''}` +
    `${sec}s`;
};

const formatTimeDurationMMMSS = (durationInSeconds) => {
  if (parseFloat(durationInSeconds) === 0) return '0:00';
  if (!durationInSeconds) return false;
  let min = Math.floor(durationInSeconds / 60);
  let sec = Math.round(durationInSeconds % 60)
    .toString()
    .padStart(2,0);
  if (sec === '60') {
    min += 1;
    sec = '00';
  }
  return `${min}:${sec}`;
};

const getTimeOffset = (date, offset) => {
  if (!date || !offset) return false;
  const d = new Date(date);
  const updatedDate = d.setSeconds(d.getSeconds() + parseFloat(offset));
  return updatedDate;
};

export {
  datetime,
  timeOnly,
  dateOnly,
  isSameDate,
  timeDifference,
  formatTimeDuration,
  formatTimeDurationMMMSS,
  getTimeOffset,
};
