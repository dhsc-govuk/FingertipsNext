export const MOCK_ENGLAND_DATA = {
  areaCode: 'E92000001',
  areaName: 'England',
  healthData: [
    {
      year: 2004,
      count: 200,
      value: 904.874,
      lowerCi: 0,
      upperCi: 0,
      ageBand: '0-4',
      sex: 'Female',
    },
    {
      year: 2008,
      count: 500,
      value: 965.9843,
      lowerCi: 0,
      upperCi: 0,
      ageBand: '10-14',
      sex: 'Female',
    },
  ],
};

export const MOCK_HEALTH_DATA = [
  {
    areaCode: 'A1425',
    areaName: 'Greater Manchester ICB - 00T',
    healthData: [
      {
        year: 2008,
        count: 222,
        value: 890.305692,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'Persons',
      },
      {
        year: 2004,
        count: 267,
        value: 703.420759,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'Persons',
      },
    ],
  },
  {
    ...MOCK_ENGLAND_DATA,
  },
  {
    areaCode: 'A1426',
    areaName: 'South FooBar',
    healthData: [
      {
        year: 2004,
        count: 222,
        value: 135.149304,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'Persons',
      },
      {
        year: 2008,
        count: 131,
        value: 890.328253,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        ageBand: 'All',
        sex: 'Persons',
      },
    ],
  },
];
