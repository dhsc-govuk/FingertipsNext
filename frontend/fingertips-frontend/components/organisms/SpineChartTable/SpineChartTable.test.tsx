import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import {
  SpineChartTableHeadingEnum,
  SpineChartTableHeader,
  SpineChartMissingValue,
  SpineChartTableRow,
  SpineChartTable,
  SpineChartTableRowData,
  mapToSpineChartTableData,
} from '.';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';

describe('Spine chart table suite', () => {
  const mockHeaderData = {
    area: 'testArea',
    group: 'testGroup',
  };

  const mockRowData = {
    indicatorId: 1,
    indicator: 'indicator',
    unit: '%',
    period: 2025,
    count: 123,
    value: 456,
    groupValue: 789,
    benchmarkValue: 987,
    benchmarkWorst: 345,
    benchmarkBest: 999,
  };

  const mockIndicatorData = [
    {
      indicatorId: 2,
      title: 'Test indicator 1',
      definition: '',
    },
    {
      indicatorId: 1,
      title: 'Test indicator 2',
      definition: '',
    },
  ];

  const mockUnits = ['kg', 'per 1000'];

  const mockHealthData = [
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
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    },
    {
      areaCode: 'A1425',
      areaName: 'Greater Manchester ICB - 00T',
      healthData: [
        {
          year: 2024,
          count: 111,
          value: 690.305692,
          lowerCi: 341.69151,
          upperCi: 478.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    },
  ];

  const mockGroup = [
    {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [
        {
          year: 2008,
          count: 111,
          value: 980.305692,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    },
    {
      areaCode: '90210',
      areaName: 'Manchester',
      healthData: [
        {
          year: 2024,
          count: 3333,
          value: 690.305692,
          lowerCi: 341.69151,
          upperCi: 478.32766,
          ageBand: 'All',
          sex: 'All',
          trend: HealthDataPointTrendEnum.NotYetCalculated,
        },
      ],
    },
  ];

  const mockBest = [1666, 22];

  const mockWorst = [959, 100];

  describe('Spine chart table header', () => {
    it('should contain the expected elements', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('empty-header')).toHaveTextContent('');
      expect(screen.getByTestId('area-header')).toHaveTextContent(
        `${mockHeaderData.area}`
      );
      expect(screen.getByTestId('group-header')).toHaveTextContent(
        `${mockHeaderData.group}`
      );
      expect(screen.getByTestId('england-header')).toHaveTextContent(
        `Benchmark: England`
      );

      Object.values(SpineChartTableHeadingEnum).forEach((heading) =>
        expect(screen.getByTestId(`${heading}-header`)).toBeInTheDocument()
      );
    });

    it('should have grey cell color for benchmark column', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('england-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );

      expect(screen.getByTestId('Value-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('Worst-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('Best-header')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should have light grey cell color for the group column', () => {
      render(
        <SpineChartTableHeader
          areaName={mockHeaderData.area}
          groupName={mockHeaderData.group}
        />
      );

      expect(screen.getByTestId('group-header')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );

      expect(screen.getByTestId('GroupValue-header')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });
  });

  describe('Spine chart table row', () => {
    it('should have grey cell color for benchmark column', () => {
      render(
        <SpineChartTableRow
          indicatorId={mockRowData.indicatorId}
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={mockRowData.count}
          value={mockRowData.value}
          groupValue={mockRowData.groupValue}
          benchmarkValue={mockRowData.benchmarkValue}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('benchmark-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('benchmark-worst-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
      expect(screen.getByTestId('benchmark-best-cell')).toHaveStyle(
        `background-color: ${GovukColours.MidGrey}`
      );
    });

    it('should have light grey cell color for benchmark column', () => {
      render(
        <SpineChartTableRow
          indicatorId={mockRowData.indicatorId}
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={mockRowData.count}
          value={mockRowData.value}
          groupValue={mockRowData.groupValue}
          benchmarkValue={mockRowData.benchmarkValue}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('group-value-cell')).toHaveStyle(
        `background-color: ${GovukColours.LightGrey}`
      );
    });

    it('should have X for missing data', () => {
      render(
        <SpineChartTableRow
          indicatorId={mockRowData.indicatorId}
          indicator={mockRowData.indicator}
          unit={mockRowData.unit}
          period={mockRowData.period}
          count={undefined}
          value={undefined}
          groupValue={undefined}
          benchmarkValue={undefined}
          benchmarkWorst={mockRowData.benchmarkWorst}
          benchmarkBest={mockRowData.benchmarkBest}
        />
      );

      expect(screen.getByTestId('count-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('value-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('group-value-cell')).toHaveTextContent(`X`);

      expect(screen.getByTestId('benchmark-value-cell')).toHaveTextContent(`X`);
    });
  });

  describe('Spine chart missing value', () => {
    it('should have the value', () => {
      render(<SpineChartMissingValue value={100} />);

      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should have X', () => {
      render(<SpineChartMissingValue value={undefined} />);

      expect(screen.getByText('X')).toBeInTheDocument();
    });
  });

  describe('Spine chart table', () => {
    it('snapshot test - should match snapshot', () => {
      const container = render(
        <SpineChartTable
          indicators={mockIndicatorData}
          measurementUnits={mockUnits}
          indicatorHealthData={mockHealthData}
          groupIndicatorData={mockGroup}
          englandBenchmarkData={MOCK_HEALTH_DATA}
          worst={mockWorst}
          best={mockBest}
        />
      );
      expect(container.asFragment()).toMatchSnapshot();
    });

    it('should render the SpineChartTable component', () => {
      render(
        <SpineChartTable
          indicators={mockIndicatorData}
          measurementUnits={mockUnits}
          indicatorHealthData={mockHealthData}
          groupIndicatorData={mockGroup}
          englandBenchmarkData={MOCK_HEALTH_DATA}
          worst={mockWorst}
          best={mockBest}
        />
      );
      const spineChart = screen.getByTestId('spineChartTable-component');
      expect(spineChart).toBeInTheDocument();
    });

    it('should render the SpineChartTable in ascending indicator order', () => {
      render(
        <SpineChartTable
          indicators={mockIndicatorData}
          measurementUnits={mockUnits}
          indicatorHealthData={mockHealthData}
          groupIndicatorData={mockGroup}
          englandBenchmarkData={MOCK_HEALTH_DATA}
          worst={mockWorst}
          best={mockBest}
        />
      );

      const expectedIndicators = ['Test indicator 2', 'Test indicator 1'];
      const indictors = screen.getAllByTestId(`indicator-cell`);
      expect(indictors[0]).toHaveTextContent(expectedIndicators[0]);
      expect(indictors[1]).toHaveTextContent(expectedIndicators[1]);
    });
  });

  describe('mapToSpineChartTableData', () => {
    it('should map to spine chart table row data', () => {
      const expectedRowData: SpineChartTableRowData[] = [
        {
          benchmarkBest: 959,
          benchmarkValue: 890.305692,
          benchmarkWorst: 1666,
          count: 222,
          groupValue: 980.305692,
          indicator: 'Test indicator 1',
          indicatorId: 2,
          period: 2008,
          unit: 'kg',
          value: 890.305692,
        },
        {
          benchmarkBest: 100,
          benchmarkValue: 135.149304,
          benchmarkWorst: 22,
          count: 111,
          groupValue: 690.305692,
          indicator: 'Test indicator 2',
          indicatorId: 1,
          period: 2024,
          unit: 'per 1000',
          value: 690.305692,
        },
      ];

      expect(
        mapToSpineChartTableData(
          mockIndicatorData,
          mockUnits,
          mockHealthData,
          mockGroup,
          MOCK_HEALTH_DATA,
          mockWorst,
          mockBest
        )
      ).toEqual(expectedRowData);
    });
  });
});
