import { SeriesLineOptions, SymbolKeyValue } from 'highcharts';
import { generateSeriesData, shouldDisplayLineChart } from './lineChartHelpers';
import { ChartColours } from '@/lib/chartHelpers/colours';

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

const chartColours: ChartColours[] = [
  ChartColours.Orange,
  ChartColours.LightPurple,
  ChartColours.DarkPink,
];

describe('generateSeriesData', () => {
  it('should generate series data without benchmark data', () => {
    const expectedSeriesData = [
      {
        color: '#F46A25',
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
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
      },
      {
        color: '#A285D1',
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
          [2010, 750.69151, 800.32766],
          [2007, 440.69151, 420.32766],
        ],
        name: 'South FooBar',
        type: 'errorbar',
        visible: false,
      },
      {
        color: '#801650',
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
      {
        data: [
          [2020, 460.69151, 500.32766],
          [2012, 220.69151, 250.32766],
        ],
        name: 'East FooBar',
        type: 'errorbar',
        visible: false,
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      undefined,
      false
    );

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
        color: '#F46A25',
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
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
      },
      {
        color: '#A285D1',
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
          [2010, 750.69151, 800.32766],
          [2007, 440.69151, 420.32766],
        ],
        name: 'South FooBar',
        type: 'errorbar',
        visible: false,
      },
      {
        color: '#801650',
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
      {
        data: [
          [2020, 460.69151, 500.32766],
          [2012, 220.69151, 250.32766],
        ],
        name: 'East FooBar',
        type: 'errorbar',
        visible: false,
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      mockBenchmarkData,
      false
    );

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should repeat symbols when there are more series than symbols', () => {
    const symbols: SymbolKeyValue[] = ['arc', 'circle'];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      undefined,
      false
    ) as SeriesLineOptions[];

    expect(generatedSeriesData[0].marker?.symbol).toBe('arc');
    expect(generatedSeriesData[1].marker?.symbol).toBe(undefined);
    expect(generatedSeriesData[2].marker?.symbol).toBe('circle');
    expect(generatedSeriesData[3].marker?.symbol).toBe(undefined);
  });

  it('should show confidence intervals bars', () => {
    const generatedSeriesData = generateSeriesData(
      [mockData[0]],
      symbols,
      chartColours,
      undefined,
      true
    );

    const expectedSeriesData = [
      {
        color: '#F46A25',
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
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: true,
      },
    ];

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should not show confidence intervals bars', () => {
    const generatedSeriesData = generateSeriesData(
      [mockData[0]],
      symbols,
      chartColours,
      undefined,
      false
    );

    const expectedSeriesData = [
      {
        color: '#F46A25',
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
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
      },
    ];

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should repeat colours when there are more series than colours', () => {
    const chartColours: ChartColours[] = [
      ChartColours.Orange,
      ChartColours.LightPurple,
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      undefined,
      false
    ) as SeriesLineOptions[];

    expect(generatedSeriesData[0].color).toBe(chartColours[0]);
    // The error bar series has no symbols hence undefined
    expect(generatedSeriesData[1].color).toBe(undefined);
    expect(generatedSeriesData[2].color).toBe(chartColours[1]);
    expect(generatedSeriesData[3].color).toBe(undefined);
    expect(generatedSeriesData[4].color).toBe(chartColours[0]);
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
