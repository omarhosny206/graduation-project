import ITimeslot from '../interfaces/users/timeslot-interface';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

export function getNumberFormat(timeslots: ITimeslot[]) {
  const result = timeslots.map((timeslot) =>
    timeslot.hours
      .map((hour) => convertHourToValue(hour))
      .sort((firstValue, secondValue) => {
        return firstValue - secondValue;
      })
      .map((value) => {
        return SECONDS_PER_DAY * timeslot.day + value;
      })
  );

  console.log(result);
  return result;
}

function convertHourToValue(hour: string) {
  const [hourPart, minutesPart] = hour.split(':');
  const hourPartValue = parseInt(hourPart);
  const minutePartValue = parseInt(minutesPart);
  return hourPartValue * SECONDS_PER_HOUR + minutePartValue * SECONDS_PER_MINUTE;
}

export function hasOverlappingInSameDay(numberFormat: number[][]) {
  for (let i = 0; i < numberFormat.length; ++i) {
    const values = numberFormat[i];

    for (let i = 0; i < values.length - 1; ++i) {
      const current = values[i];
      const next = values[i + 1];
      if (current + SECONDS_PER_HOUR > next) {
        console.log('OVERLAPPING FOUND:', { current: current, next: next });
        return true;
      }
    }
  }

  return false;
}

export function hasOverlappingInDifferentDays(numberFormat: number[][]) {
  for (let i = 0; i < numberFormat.length; ++i) {
    const previousIndex = (i + numberFormat.length - 1) % numberFormat.length;

    if (!numberFormat[i].length || !numberFormat[previousIndex].length) {
      continue;
    }

    const nextValues = numberFormat[i];
    const previousValues = numberFormat[previousIndex];

    if (previousIndex > i) {
      const previous = previousValues[previousValues.length - 1] - (numberFormat.length - 1) * SECONDS_PER_DAY;
      const next = nextValues[0] + SECONDS_PER_DAY;

      if (previous + SECONDS_PER_HOUR > next) {
        console.log('OVERLAPPING FOUND:', { next: nextValues[0], previous: previousValues[previousValues.length - 1] });
        return true;
      }
    } else {
      const previous = previousValues[previousValues.length - 1];
      const next = nextValues[0];

      if (previous + SECONDS_PER_HOUR > next) {
        console.log('OVERLAPPING FOUND:', { next: next, previous: previous });
        return true;
      }
    }
  }

  return false;
}
