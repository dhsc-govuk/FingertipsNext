/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SeriesLineOptions,
  SeriesOptionsType,
  SymbolKeyValue,
} from 'highcharts';
import {
  addShowHideLinkedSeries,
  generateSeriesData,
  generateStandardLineChartOptions,
} from './lineChartHelpers';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { mockIndicatorData, mockBenchmarkData, mockParentData } from './mocks';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { Dispatch, SetStateAction } from 'react';

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
        custom: { areaCode: 'A1425' },
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
        color: '#A285D1',
        custom: { areaCode: 'A1426' },
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
        color: '#801650',
        custom: { areaCode: 'A1427' },
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
        custom: { areaCode: areaCodeForEngland },
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
        custom: { areaCode: 'A1425' },
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
        color: '#A285D1',
        custom: { areaCode: 'A1426' },
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
        color: '#801650',
        custom: { areaCode: 'A1427' },
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
        custom: { areaCode: areaCodeForEngland },
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
        custom: { areaCode: 'P001' },
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
        custom: { areaCode: 'A1425' },
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
        color: '#A285D1',
        custom: { areaCode: 'A1426' },
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
        color: '#801650',
        custom: { areaCode: 'A1427' },
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
    expect(generatedSeriesData[1].marker?.symbol).toBe('circle');
    expect(generatedSeriesData[2].marker?.symbol).toBe('arc');
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
        custom: { areaCode: 'A1425' },
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
        linkedTo: 'North FooBar',
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
        custom: { areaCode: 'A1425' },
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
    ];

    expect(generatedSeriesData).toEqual(expectedSeriesData);
  });

  it('should repeat colours when there are more series than colours', () => {
    const chartColours: GovukColours[] = [
      GovukColours.Orange,
      GovukColours.LightPurple,
    ];

    const generatedSeriesData = generateSeriesData(
      mockIndicatorData,
      symbols,
      chartColours,
      undefined,
      undefined,
      false
    ) as SeriesLineOptions[];

    expect(generatedSeriesData[0].color).toBe(chartColours[0]);
    expect(generatedSeriesData[1].color).toBe(chartColours[1]);
    expect(generatedSeriesData[2].color).toBe(chartColours[0]);
  });
});

describe('generateStandardLineChartOptions', () => {
  it('should generate standard line chart options', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      {
        benchmarkData: undefined,
        groupIndicatorData: undefined,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      }
    );

    expect((generatedOptions.yAxis as any)!.title.text).toBe('yAxis');
    expect((generatedOptions.xAxis as any)!.title.text).toBe('xAxis');
    expect(generatedOptions.accessibility!.description).toBe('accessibility');
    expect((generatedOptions.xAxis as any)!.max).toBe(2006);
    expect((generatedOptions.xAxis as any)!.min).toBe(2004);

    expect(generatedOptions).toMatchSnapshot();
  });

  it('should generate standard line chart options with benchmark data', () => {
    const generatedOptions = generateStandardLineChartOptions(
      [mockIndicatorData[0]],
      false,
      {
        benchmarkData: mockBenchmarkData,
        groupIndicatorData: mockParentData,
        yAxisTitle: 'yAxis',
        xAxisTitle: 'xAxis',
        measurementUnit: '%',
        accessibilityLabel: 'accessibility',
        colours: chartColours,
        symbols,
      }
    );
    expect(generatedOptions).toMatchSnapshot();
    expect((generatedOptions.xAxis as any)!.max).toBe(2006);
    expect((generatedOptions.xAxis as any)!.min).toBe(2004);
  });
});

describe('addShowHideLinkedSeries', () => {
  let generatedSeriesData: SeriesOptionsType[];
  let setVisibility: Dispatch<SetStateAction<Record<string, boolean>>>;

  beforeEach(() => {
    generatedSeriesData = generateSeriesData(
      [mockIndicatorData[0]],
      symbols,
      chartColours,
      undefined,
      undefined,
      true
    );

    setVisibility = jest.fn() as Dispatch<
      SetStateAction<Record<string, boolean>>
    >;
  });

  it('should add add show and hide functions which call setVisibility (state)', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      {},
      setVisibility
    );

    const [first] = generatedSeriesData;
    if ('events' in first) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      first.events.show({});
    }
    expect(setVisibility).toBeCalledTimes(1);
    expect(setVisibility).toBeCalledWith({ 'North FooBar': true });

    if ('events' in first) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      first.events.hide({});
    }
    expect(setVisibility).toBeCalledTimes(2);
    expect(setVisibility).toBeCalledWith({ 'North FooBar': false });
  });

  it('should set the initial visibility of linkedTo series to false', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      {},
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', false);
  });

  it('should set the visibility of linkedTo series to false if true in state but showConfidenceIntervalsData is false', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      false,
      { 'North FooBar': true },
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', false);
  });

  it('should set the visibility of linkedTo series to true if set in state and showConfidenceIntervalsData is true', () => {
    addShowHideLinkedSeries(
      { series: generatedSeriesData },
      true,
      { 'North FooBar': true },
      setVisibility
    );

    expect(generatedSeriesData[0]).not.toHaveProperty('visible');
    expect(generatedSeriesData[1]).toHaveProperty('visible', true);
  });
});
