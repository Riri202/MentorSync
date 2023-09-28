import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export const get30MinuteIntervals = (startTime: string, endTime: string) => {
  const intervals: string[] = [];
  const formatStr = 'HH:mm';
  let current = parse(startTime, formatStr, new Date());
  const end = parse(endTime, formatStr, new Date());
  while (current < end) {
    intervals.push(format(current, formatStr));
    current = addMinutes(current, 30);
  }
  return intervals;
};
