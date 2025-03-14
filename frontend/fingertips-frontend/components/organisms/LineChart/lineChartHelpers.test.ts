import { SeriesLineOptions, SymbolKeyValue } from 'highcharts';
import { generateSeriesData } from './lineChartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

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
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        count: 267,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 703.420759,
        year: 2004,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
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
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        count: 567,
        lowerCi: 440.69151,
        upperCi: 420.32766,
        value: 435.420759,
        year: 2007,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
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
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
      {
        count: 567,
        lowerCi: 220.69151,
        upperCi: 250.32766,
        value: 234.420759,
        year: 2012,
        sex: 'Persons',
        ageBand: 'All',
        trend: HealthDataPointTrendEnum.NotYetCalculated,
      },
    ],
  },
];

const symbols: SymbolKeyValue[] = ['arc', 'circle', 'diamond'];

const chartColours: GovukColours[] = [
  GovukColours.Orange,
  GovukColours.LightPurple,
  GovukColours.DarkPink,
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
        color: '#B1B4B6',
        data: [
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2010, 750.69151, 800.32766],
          [2007, 440.69151, 420.32766],
        ],
        name: 'South FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2020, 460.69151, 500.32766],
          [2012, 220.69151, 250.32766],
        ],
        name: 'East FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      undefined,
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
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
        {
          count: 267,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 703.420759,
          year: 2004,
          sex: 'Persons',
          ageBand: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    };

    const expectedSeriesData = [
      {
        color: GovukColours.DarkGrey,
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
        color: '#B1B4B6',
        data: [
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2010, 750.69151, 800.32766],
          [2007, 440.69151, 420.32766],
        ],
        name: 'South FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2020, 460.69151, 500.32766],
          [2012, 220.69151, 250.32766],
        ],
        name: 'East FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      mockBenchmarkData,
      undefined,
      false
    );

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should generate series data with parent data', () => {
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
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
        {
          count: 267,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 703.420759,
          year: 2004,
          sex: 'Persons',
          ageBand: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    };

    const mockParentData = {
      areaCode: 'P001',
      areaName: 'Parent',
      healthData: [
        {
          count: 100,
          lowerCi: 200,
          upperCi: 400,
          value: 300,
          year: 2006,
          sex: 'Persons',
          ageBand: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
        {
          count: 101,
          lowerCi: 201,
          upperCi: 401,
          value: 301,
          year: 2004,
          sex: 'Persons',
          ageBand: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    };

    const expectedSeriesData = [
      {
        color: GovukColours.DarkGrey,
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
        color: GovukColours.Turquoise,
        data: [
          [2006, 300],
          [2004, 301],
        ],
        marker: {
          symbol: 'diamond',
        },
        name: 'Group: Parent',
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
        color: '#B1B4B6',
        data: [
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2010, 750.69151, 800.32766],
          [2007, 440.69151, 420.32766],
        ],
        name: 'South FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2020, 460.69151, 500.32766],
          [2012, 220.69151, 250.32766],
        ],
        name: 'East FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
      },
    ];

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      mockBenchmarkData,
      mockParentData,
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
      undefined,
      false
    ) as SeriesLineOptions[];

    expect(generatedSeriesData[0].marker?.symbol).toBe('arc');
    // The error bar series has no symbol hence undefined
    expect(generatedSeriesData[1].marker?.symbol).toBe(undefined);
    expect(generatedSeriesData[2].marker?.symbol).toBe('circle');
    expect(generatedSeriesData[3].marker?.symbol).toBe(undefined);
    expect(generatedSeriesData[4].marker?.symbol).toBe('arc');
  });

  it('should show confidence intervals bars', () => {
    const generatedSeriesData = generateSeriesData(
      [mockData[0]],
      symbols,
      chartColours,
      undefined,
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
        color: '#B1B4B6',
        data: [
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: true,
        lineWidth: 2,
        whiskerLength: '20%',
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
        color: '#B1B4B6',
        data: [
          [2006, 441.69151, 578.32766],
          [2004, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
      },
    ];

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should repeat colours when there are more series than colours', () => {
    const chartColours: GovukColours[] = [
      GovukColours.Orange,
      GovukColours.LightPurple,
    ];
    const errorBarColour = '#B1B4B6';

    const generatedSeriesData = generateSeriesData(
      mockData,
      symbols,
      chartColours,
      undefined,
      undefined,
      false
    ) as SeriesLineOptions[];

    expect(generatedSeriesData[0].color).toBe(chartColours[0]);
    expect(generatedSeriesData[1].color).toBe(errorBarColour);
    expect(generatedSeriesData[2].color).toBe(chartColours[1]);
    expect(generatedSeriesData[3].color).toBe(errorBarColour);
    expect(generatedSeriesData[4].color).toBe(chartColours[0]);
  });
});
