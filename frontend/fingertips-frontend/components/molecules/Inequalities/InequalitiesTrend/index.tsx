import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/lineChartHelpers';
import { H4 } from 'govuk-react';
import { InequalitiesLineChartTable } from '../LineChart/Table';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
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
  InequalitiesTypes,
  mapToInequalitiesTableData,
  valueSelectorForInequality,
  sequenceSelectorForInequality,
  filterHealthData,
  healthDataFilterFunctionGeneratorForInequality,
  getInequalityCategory,
  getYearsWithInequalityData,
  getAreasWithSexInequalitiesData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { seriesDataWithoutGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ChartSelectArea } from '../../ChartSelectArea';

interface InequalitiesTrendProps {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  measurementUnit?: string;
}

const generateInequalitiesLineChartTooltipForPoint = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
    <span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.series.name}</br>Value: ${formatNumber(point.y)}`,
];

export function InequalitiesTrend({
  healthIndicatorData,
  measurementUnit,
  searchState,
}: Readonly<InequalitiesTrendProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.InequalityTypeSelected]: inequalityTypeSelected,
    [SearchParams.InequalityLineChartAreaSelected]:
      inequalityLineChartAreaSelected,
  } = stateManager.getSearchState();

  const [
    showInequalitiesLineChartConfidenceIntervals,
    setShowInequalitiesLineChartConfidenceIntervals,
  ] = useState<boolean>(false);

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthIndicatorData,
    selectedGroupCode
  );

  const availableAreasWithInequalities =
    inequalityTypeSelected === 'sex' || inequalityTypeSelected === undefined
      ? getAreasWithSexInequalitiesData(healthdataWithoutGroup)
      : [];

  const areaToUse =
    inequalityLineChartAreaSelected ??
    healthdataWithoutGroup[0].areaCode ??
    areaCodeForEngland;

  const healthDataForArea = healthdataWithoutGroup.find(
    (data) => data.areaCode === areaToUse
  );

  if (!healthDataForArea) return null;

  // This will be updated when we add the dropdown to select inequality types
  const type =
    inequalityTypeSelected === 'deprivation'
      ? InequalitiesTypes.Deprivation
      : InequalitiesTypes.Sex;

  const inequalityCategory = getInequalityCategory(type, healthDataForArea);

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthIndicatorData,
    healthData: filterHealthData(
      healthDataForArea.healthData,
      filterFunctionGenerator(inequalityCategory)
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

  const inequalitiesLineChartOptions: Highcharts.Options =
    generateInequalitiesLineChartOptions(
      lineChartData,
      dynamicKeys,
      type,
      showInequalitiesLineChartConfidenceIntervals,
      generateInequalitiesLineChartTooltipForPoint,
      {
        areasSelected,
        yAxisTitleText: 'Value',
        xAxisTitleText: 'Year',
        measurementUnit,
      }
    );

  return (
    <div data-testid="inequalitiesTrend-component">
      <H4>Inequalities data over time</H4>
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
      />
    </div>
  );
}
