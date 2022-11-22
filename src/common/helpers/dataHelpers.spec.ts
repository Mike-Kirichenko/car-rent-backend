import { BadRequestException } from '@nestjs/common';
import { formatDate, getDayDiff, isWeekEndDay } from './dateHelpers';

describe('Should return number of days which must be positive', () => {
  try {
    expect(getDayDiff(new Date('2022-10-15'), new Date('2022-10-11'))).toBe(4);
  } catch (e) {
    expect(e).toBeInstanceOf(BadRequestException);
  }

  try {
    expect(getDayDiff(new Date('2022-10-11'), new Date('2022-10-15'))).toBe(4);
  } catch (e) {
    expect(e).toBeInstanceOf(BadRequestException);
  }
});

test('Should return boolean answer on question if day is weekend day', () => {
  expect(isWeekEndDay(new Date('2022-11-09'))).toBe(false);
  expect(isWeekEndDay(new Date('2022-11-12'))).toBe(true);
});

test('Should string in format YYYY-MM-DD', () => {
  expect(formatDate(new Date(2022, 4, 18))).toBe('2022-05-18');
  expect(formatDate(new Date(2022, 4, 5))).toBe('2022-05-05');
});
