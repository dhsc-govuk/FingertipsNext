import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { sortByValueAndAreaName } from '@/lib/healthDataHelpers/sortByValueAndAreaName';

const mockPoint = {
  ...mockHealthDataPoint({ value: 99 }),
  area: 'Apple',
  areaCode: '1',
};

describe('sortByValueAndAreaName', () => {
  it('should return 0 if both are zero', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, value: 0 },
        { ...mockPoint, value: 0 }
      )
    ).toEqual(0);
  });

  it('should return 0 if a and b are undefined', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, value: undefined },
        { ...mockPoint, value: undefined }
      )
    ).toEqual(0);
  });

  it('should return 1 if a is zero', () => {
    expect(
      sortByValueAndAreaName({ ...mockPoint, value: 0 }, mockPoint)
    ).toEqual(1);
  });

  it('should return -1 if b is zero', () => {
    expect(
      sortByValueAndAreaName(mockPoint, { ...mockPoint, value: 0 })
    ).toEqual(-1);
  });

  it('should return 1 if a is less than b', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, value: 4 },
        { ...mockPoint, value: 5 }
      )
    ).toEqual(1);
  });

  it('should return -1 if a is greater than b', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, value: 5 },
        { ...mockPoint, value: 4 }
      )
    ).toEqual(-1);
  });

  it('should return -1 if a is alphabetically first', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, area: 'Apples' },
        { ...mockPoint, area: 'Bananas' }
      )
    ).toEqual(-1);
  });

  it('should return 1 if b is alphabetically first', () => {
    expect(
      sortByValueAndAreaName(
        { ...mockPoint, area: 'Cherries' },
        { ...mockPoint, area: 'Bananas' }
      )
    ).toEqual(1);
  });

  it('should return 0 if a and b have same value and alphabetical order', () => {
    expect(sortByValueAndAreaName(mockPoint, mockPoint)).toEqual(0);
  });
});
