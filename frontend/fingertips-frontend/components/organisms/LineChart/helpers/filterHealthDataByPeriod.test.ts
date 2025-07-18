import { filterHealthDataByPeriod } from './filterHealthDataByPeriod';

describe('filterHealthDataByPeriod', () => {
  const mockHealthData = [
    {
      datePeriod: { from: new Date('2000-01-01') },
      value: 1,
    },
    {
      datePeriod: { from: new Date('2005-01-01') },
      value: 2,
    },
    {
      datePeriod: { from: new Date('2010-01-01') },
      value: 3,
    },
  ];

  const mockArea = {
    areaCode: 'E1',
    areaName: 'England',
    healthData: mockHealthData,
  };

  it('filters healthData within the given period', () => {
    const firstDate = new Date('2004-01-01').getTime();
    const lastDate = new Date('2006-01-01').getTime();

    const result = filterHealthDataByPeriod(mockArea, firstDate, lastDate);

    expect(result?.healthData).toHaveLength(1);
    expect(result?.healthData[0].value).toBe(2);
  });

  it('returns all data if firstDateAsNumber or lastDateAsNumber is undefined', () => {
    const result = filterHealthDataByPeriod(mockArea, undefined, undefined);
    expect(result?.healthData).toHaveLength(3);
  });

  it('returns undefined if data is undefined', () => {
    const result = filterHealthDataByPeriod(undefined, 0, 0);
    expect(result).toBeUndefined();
  });

  it('returns all data if healthData is missing', () => {
    const areaWithoutHealthData = {
      areaCode: 'E1',
      areaName: 'England',
      healthData: [],
    };
    const result = filterHealthDataByPeriod(areaWithoutHealthData, 0, 0);
    expect(result).toEqual(areaWithoutHealthData);
  });

  it('returns filtered group data', () => {
    const groupData = {
      areaCode: 'G1',
      areaName: 'Group',
      healthData: [
        { datePeriod: { from: new Date('2001-01-01') }, value: 10 },
        { datePeriod: { from: new Date('2007-01-01') }, value: 20 },
      ],
    };
    const firstDate = new Date('2000-01-01').getTime();
    const lastDate = new Date('2005-01-01').getTime();

    const result = filterHealthDataByPeriod(groupData, firstDate, lastDate);

    expect(result?.healthData).toHaveLength(1);
    expect(result?.healthData[0].value).toBe(10);
  });
});
