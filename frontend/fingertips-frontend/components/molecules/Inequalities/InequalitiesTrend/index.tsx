import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/lineChartHelpers';
import { H3 } from 'govuk-react';
import { InequalitiesLineChartTable } from '../LineChart/Table';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import {
  generateInequalitiesLineChartOptions,
  getDynamicKeys,
  reorderItemsArraysToEnd,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesChartData,
  mapToInequalitiesTableData,
  valueSelectorForInequality,
  sequenceSelectorForInequality,
  filterHealthData,
  healthDataFilterFunctionGeneratorForInequality,
  getYearsWithInequalityData,
  getAreasWithInequalitiesData,
  getInequalityCategories,
  getInequalitiesType,
  InequalitiesTypes,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import {
  AreaTypeLabelEnum,
  createTooltipHTML,
  determineAreaCodes,
  determineHealthDataForArea,
  getTooltipContent,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { ChartSelectArea } from '../../ChartSelectArea';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';

interface InequalitiesTrendProps {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  measurementUnit?: string;
  dataSource?: string;
}

const getBenchmarkOutcomeForYear = (
  year: number,
  inequality: string,
  chartData: InequalitiesChartData
) => {
  return chartData.rowData.find((point) => point.period === Number(year))
    ?.inequalities[inequality]?.benchmarkComparison?.outcome;
};

export function InequalitiesTrend({
  healthIndicatorData,
  measurementUnit,
  searchState,
  benchmarkComparisonMethod,
  dataSource,
}: Readonly<InequalitiesTrendProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.InequalityLineChartTypeSelected]: inequalityTypeSelected,
    [SearchParams.InequalityLineChartAreaSelected]:
      inequalityLineChartAreaSelected,
  } = stateManager.getSearchState();

  const areaCodes = determineAreaCodes(areasSelected);

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthIndicatorData,
    selectedGroupCode,
    true
  );

  const healthDataForArea = determineHealthDataForArea(
    healthdataWithoutGroup,
    inequalityLineChartAreaSelected
  );

  if (!healthDataForArea) return null;

  const inequalityCategories = getInequalityCategories(
    healthDataForArea,
    undefined,
    'trend'
  );
  if (!inequalityCategories.length) return null;

  const type = getInequalitiesType(
    inequalityCategories,
    inequalityTypeSelected
  );

  const availableAreasWithInequalities = getAreasWithInequalitiesData(
    healthdataWithoutGroup,
    type
  );

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthIndicatorData,
    healthData: filterHealthData(
      healthDataForArea.healthData,
      filterFunctionGenerator(inequalityTypeSelected ?? inequalityCategories[0])
    ),
  };

  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorDataWithoutOtherInequalities.healthData
  );

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(
      yearlyHealthdata,
      valueSelectorForInequality[type]
    );

  const sequenceSelector = sequenceSelectorForInequality[type];
  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector
  );
  const orderedDynamicKeys = reorderItemsArraysToEnd(dynamicKeys, ['Persons']);
  const allData = mapToInequalitiesTableData(
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector
  );

  const yearsDesc = getYearsWithInequalityData(allData);

  if (!yearsDesc.length || allData.length < 2) return null;

  const lineChartData: InequalitiesChartData = {
    areaName: healthDataForArea.areaName,
    rowData: allData,
  };

  const generateInequalitiesLineChartTooltipForPoint = (
    point: Highcharts.Point,
    symbol: string
  ) => {
    const { benchmarkLabel, comparisonLabel } = getTooltipContent(
      getBenchmarkOutcomeForYear(point.x, point.series.name, lineChartData) ??
        BenchmarkOutcome.NotCompared,
      AreaTypeLabelEnum.Area,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
      type === InequalitiesTypes.Sex ? lineChartData.areaName : undefined
    );

    const benchmarkComparisonSymbol = `<span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span>`;
    const shouldHideLines = lineChartData.rowData.every(
      (dataPoint) => dataPoint.inequalities[point.series.name]?.isAggregate
    );

    return createTooltipHTML(
      {
        areaName: lineChartData.areaName,
        period: point.x,
        fieldName: point.series.name,
        benchmarkComparisonSymbol,
        shouldHideComparison: shouldHideLines,
        benchmarkLabel,
        comparisonLabel,
      },
      point.y,
      measurementUnit
    );
  };

  const inequalitiesLineChartOptions: Highcharts.Options =
    generateInequalitiesLineChartOptions(
      lineChartData,
      dynamicKeys,
      type,
      true,
      generateInequalitiesLineChartTooltipForPoint,
      {
        areasSelected: areaCodes,
        yAxisTitleText: 'Value',
        xAxisTitleText: 'Period',
        measurementUnit,
        inequalityLineChartAreaSelected,
      }
    );

  return (
    <StyleChartWrapper data-testid="inequalitiesTrend-component">
      <H3>Inequalities data over time</H3>
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityLineChartTypeSelected
        }
        testRef="lc"
        searchState={searchState}
      />
      <ChartSelectArea
        availableAreas={availableAreasWithInequalities}
        chartAreaSelectedKey={SearchParams.InequalityLineChartAreaSelected}
        searchState={searchState}
      />
      <TabContainer
        id="inequalitiesLineChartAndTable"
        items={[
          {
            id: 'inequalitiesLineChart',
            title: 'Line chart',
            content: (
              <LineChart
                lineChartOptions={inequalitiesLineChartOptions}
                variant={LineChartVariant.Inequalities}
              />
            ),
          },
          {
            id: 'inequalitiesLineChartTable',
            title: 'Table',
            content: (
              <InequalitiesLineChartTable
                tableData={lineChartData}
                measurementUnit={measurementUnit}
                dynamicKeys={orderedDynamicKeys}
              />
            ),
          },
        ]}
        footer={<DataSource dataSource={dataSource} />}
      />
    </StyleChartWrapper>
  );
}
