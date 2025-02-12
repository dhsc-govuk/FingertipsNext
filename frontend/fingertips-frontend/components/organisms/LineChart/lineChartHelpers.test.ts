import { SymbolKeyValue } from 'highcharts';
import { generateSeriesData, shouldDisplayLineChart } from './lineChartHelpers';

const mockData = [
  {
    areaCode: 'A1425',
    areaName: 'North FooBar',
    healthData: [
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: 'Persons',
        ageBand: 'All',
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
      },
    ],
  },
  {
    areaCode: 'A1426',
    areaName: 'South FooBar',
    healthData: [
      {
        count: 654,
        lowerCi: 750.69151,
        upperCi: 800.32766,
        value: 786.27434,
        year: 2010,
        sex: 'Persons',
        ageBand: 'All',
      },
      {
        count: 567,
        lowerCi: 440.69151,
        upperCi: 420.32766,
        value: 435.420759,
        year: 2007,
        sex: 'Persons',
        ageBand: 'All',
      },
    ],
  },
  {
    areaCode: 'A1427',
    areaName: 'East FooBar',
    healthData: [
      {
        count: 953,
        lowerCi: 460.69151,
        upperCi: 500.32766,
        value: 478.27434,
        year: 2020,
        sex: 'Persons',
        ageBand: 'All',
      },
      {
        count: 567,
        lowerCi: 220.69151,
        upperCi: 250.32766,
        value: 234.420759,
        year: 2012,
        sex: 'Persons',
        ageBand: 'All',
      },
    ],
  },
];

const symbols: SymbolKeyValue[] = ['arc', 'circle', 'diamond'];

describe('generateSeriesData', () => {
  it('should generate series data without benchmark data', () => {
    const expectedSeriesData = [
      {
        data: [
          [2006, 278.29134],
          [2004, 703.420759],
        ],
        name: 'North FooBar',
        type: 'line',
        marker: {
          symbol: 'arc',
        },
      },
      {
        data: [
          [2010, 786.27434],
          [2007, 435.420759],
        ],
        name: 'South FooBar',
        type: 'line',
        marker: {
          symbol: 'circle',
        },
      },
      {
        data: [
          [2020, 478.27434],
          [2012, 234.420759],
        ],
        name: 'East FooBar',
        type: 'line',
        marker: {
          symbol: 'diamond',
        },
      },
    ];

    const generatedSeriesData = generateSeriesData(mockData, symbols);

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should generate series data with benchmark data', () => {
    const mockBenchmarkData = {
      areaCode: 'E92000001',
      areaName: 'England',
      healthData: [
        {
          count: 389,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 278.29134,
          year: 2006,
          sex: 'Persons',
          ageBand: 'All',
        },
        {
          count: 267,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 703.420759,
          year: 2004,
          sex: 'Persons',
          ageBand: 'All',
        },
      ],
    };

    const expectedSeriesData = [
      {
        color: 'black',
        data: [
          [2006, 278.29134],
          [2004, 703.420759],
        ],
        marker: {
          symbol: 'circle',
        },
        name: 'Benchmark: England',
        type: 'line',
      },
      {
        data: [
          [2006, 278.29134],
          [2004, 703.420759],
        ],
        name: 'North FooBar',
        type: 'line',
        marker: {
          symbol: 'arc',
        },
      },
      {
        data: [
          [2010, 786.27434],
          [2007, 435.420759],
        ],
        name: 'South FooBar',
        type: 'line',
        marker: {
          symbol: 'circle',
        },
      },
      {
        data: [
          [2020, 478.27434],
          [2012, 234.420759],
        ],
        name: 'East FooBar',
        type: 'line',
        marker: {
          symbol: 'diamond',
        },
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      mockBenchmarkData
    );

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should repeat symbols when there are more series than symbols', () => {
    const symbols: SymbolKeyValue[] = ['arc', 'circle'];

    const generatedSeriesData = generateSeriesData(mockData, symbols);

    expect(generatedSeriesData[0].marker?.symbol).toBe('arc');
    expect(generatedSeriesData[1].marker?.symbol).toBe('circle');
    expect(generatedSeriesData[2].marker?.symbol).toBe('arc');
  });
});

describe('should display line chart', () => {
  describe('should return false', () => {
    it('should return false when more than 1 indicator is selected', () => {
      expect(shouldDisplayLineChart(mockData, ['1', '2'], ['A1425'])).toBe(
        false
      );
    });

    it('should return false when more than 2 area codes are selected for an indicator', () => {
      expect(
        shouldDisplayLineChart(mockData, ['1'], ['A1425', 'A1426', 'A1427'])
      ).toBe(false);
    });

    it('should return false when health data contains less than 2 time periods', () => {
      const data = [
        {
          areaCode: 'A1426',
          areaName: 'Area 2',
          healthData: [mockData[0].healthData[0]],
        },
      ];
      expect(shouldDisplayLineChart(data, ['1'], ['A1426'])).toBe(false);
    });
  });

  describe('should return true', () => {
    it('should return true when 1 indicator is selected, 2 areas are selected, and there are multiple data points', () => {
      expect(
        shouldDisplayLineChart(
          [mockData[0], mockData[1]],
          ['1'],
          ['A1425', 'A1426']
        )
      ).toBe(true);
    });
  });
});
