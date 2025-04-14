import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/lineChartHelpers';
import { H3 } from 'govuk-react';
import { InequalitiesLineChartTable } from '../LineChart/Table';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useState } from 'react';
import {
  generateInequalitiesLineChartOptions,
  getDynamicKeys,
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
import { formatNumber } from '@/lib/numberFormatter';
import {
  determineAreaCodes,
  determineHealthDataForArea,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { ChartSelectArea } from '../../ChartSelectArea';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  AreaTypeLabelEnum,
  getTooltipContent,
} from '@/lib/chartHelpers/chartHelpers';

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
  const [
    showInequalitiesLineChartConfidenceIntervals,
    setShowInequalitiesLineChartConfidenceIntervals,
  ] = useState<boolean>(false);

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

  const inequalityCategories = getInequalityCategories(healthDataForArea);
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
    const label =
      healthDataForArea.areaCode === areaCodeForEngland
        ? AreaTypeLabelEnum.Benchmark
        : AreaTypeLabelEnum.Area;
    const { benchmarkLabel, category, comparisonLabel } = getTooltipContent(
      getBenchmarkOutcomeForYear(point.x, point.series.name, lineChartData) ??
        'NotCompared',
      label,
      benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
      type === InequalitiesTypes.Sex ? lineChartData.areaName : undefined
    );
    const comparisonLabelForInequality =
      type === InequalitiesTypes.Deprivation
        ? comparisonLabel
        : `persons ${comparisonLabel}`;

    const shouldHideLines = lineChartData.rowData.every(
      (dataPoint) => dataPoint.inequalities[point.series.name]?.isAggregate
    );

    return [
      `<div style="padding-right: 25px">`,
      `<span style="font-weight: bold">${category}${lineChartData.areaName}</span><br/>`,
      `<span>${point.x}</span><br/><span>${type === InequalitiesTypes.Deprivation && label === AreaTypeLabelEnum.Benchmark ? '' : point.series.name}</span><br/>`,
      `<div style="display: flex; margin-top: 15px; align-items: center;">`,
      `<div style="margin-right: 10px;"><span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
      `<div style="padding-right: 10px;"><span>${formatNumber(point.y)} ${measurementUnit ? ' ' + measurementUnit : ''}</span><br/>`,
      `${label === AreaTypeLabelEnum.Benchmark || shouldHideLines ? '' : `<span>${benchmarkLabel}</span><br/>`}`,
      `${label === AreaTypeLabelEnum.Benchmark || shouldHideLines ? '' : `<span>${comparisonLabelForInequality}</span><br/>`}`,
      `</div`,
      `</div>`,
    ];
  };

  const inequalitiesLineChartOptions: Highcharts.Options =
    generateInequalitiesLineChartOptions(
      lineChartData,
      dynamicKeys,
      type,
      showInequalitiesLineChartConfidenceIntervals,
      generateInequalitiesLineChartTooltipForPoint,
      {
        areasSelected: areaCodes,
        yAxisTitleText: 'Value',
        xAxisTitleText: 'Year',
        measurementUnit,
      }
    );

  return (
    <div data-testid="inequalitiesTrend-component">
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
                showConfidenceIntervalsData={
                  showInequalitiesLineChartConfidenceIntervals
                }
                setShowConfidenceIntervalsData={
                  setShowInequalitiesLineChartConfidenceIntervals
                }
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
                dynamicKeys={dynamicKeys}
              />
            ),
          },
        ]}
        footer={<DataSource dataSource={dataSource} />}
      />
    </div>
  );
}
