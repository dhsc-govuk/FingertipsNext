import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/lineChartHelpers';
import { H3 } from 'govuk-react';
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
  getYearsWithInequalityData,
  sexCategory,
  InequalitiesComponentType,
  getInequalityCategories,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { formatNumber } from '@/lib/numberFormatter';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';

interface InequalitiesTrendProps {
  healthIndicatorData: HealthDataForArea;
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
  searchState,
  measurementUnit,
}: Readonly<InequalitiesTrendProps>) {
  const [
    showInequalitiesLineChartConfidenceIntervals,
    setShowInequalitiesLineChartConfidenceIntervals,
  ] = useState<boolean>(false);
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.InequalityLineChartTypeSelected]: inequalityTypeSelected,
  } = stateManager.getSearchState();

  const inequalityCategories = getInequalityCategories(healthIndicatorData);

  if (!inequalityCategories.length) return null;

  const type =
    inequalityCategories[0] === sexCategory ||
    inequalityTypeSelected === sexCategory
      ? InequalitiesTypes.Sex
      : InequalitiesTypes.Deprivation;

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthIndicatorData,
    healthData: filterHealthData(
      healthIndicatorData.healthData,
      filterFunctionGenerator(inequalityCategories[0])
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
    areaName: healthIndicatorData.areaName,
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
      <H3>Inequalities data over time</H3>
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        component={InequalitiesComponentType.Linechart}
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
