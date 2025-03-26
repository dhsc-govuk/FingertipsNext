import { SeriesLineOptions, SymbolKeyValue } from 'highcharts';
import {
  generateSeriesData,
  generateStandardLineChartOptions,
  lineChartDefaultOptions,
} from './lineChartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { mockIndicatorData, mockBenchmarkData, mockParentData } from './mocks';

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
      mockIndicatorData,
      symbols,
      chartColours,
      undefined,
      undefined,
      false
    );

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should generate series data with benchmark data', () => {
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
      mockIndicatorData,
      symbols,
      chartColours,
      mockBenchmarkData,
      undefined,
      false
    );

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should generate series data with parent data', () => {
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
      mockIndicatorData,
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
      mockIndicatorData,
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
      [mockIndicatorData[0]],
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
      [mockIndicatorData[0]],
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
      mockIndicatorData,
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

describe('generateStandardLineChartOptions', () => {
  it('should generate standard line chart options', () => {
    const expectedSeriesData = [
      {
        color: '#F46A25',
        data: [
          [2004, 703.420759],
          [2006, 278.29134],
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
          [2004, 441.69151, 578.32766],
          [2006, 441.69151, 578.32766],
        ],
        name: 'North FooBar',
        type: 'errorbar',
        visible: false,
        lineWidth: 2,
        whiskerLength: '20%',
      },
    ];

    const expected = {
      ...lineChartDefaultOptions,
      yAxis: {
        ...lineChartDefaultOptions.yAxis,
        title: { text: 'yAxis', margin: 20 },
      },
      xAxis: {
        ...lineChartDefaultOptions.xAxis,
        title: { text: 'xAxis', margin: 20 },
      },
      legend: {
        ...lineChartDefaultOptions.legend,
        title: { text: 'Areas' },
      },
      accessibility: {
        ...lineChartDefaultOptions.accessibility,
        description: 'accessibility',
      },
      series: expectedSeriesData,
      tooltip: {
        format: lineChartDefaultOptions.tooltip?.format + '%',
      },
    };

    expect(
      generateStandardLineChartOptions([mockIndicatorData[0]], false, {
        benchmarkData: undefined,
        groupIndicatorData: undefined,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      })
    ).toEqual(expected);
  });

  it('should generate standard line chart options with benchmark data', () => {
    expect(
      generateStandardLineChartOptions([mockIndicatorData[0]], false, {
        benchmarkData: mockBenchmarkData,
        groupIndicatorData: mockParentData,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      })
    ).toMatchSnapshot();
  });
});
