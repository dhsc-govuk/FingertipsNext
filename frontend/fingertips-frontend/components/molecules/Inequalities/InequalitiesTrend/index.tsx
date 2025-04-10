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
  mapToInequalitiesTableData,
  valueSelectorForInequality,
  sequenceSelectorForInequality,
  filterHealthData,
  healthDataFilterFunctionGeneratorForInequality,
  getYearsWithInequalityData,
  getAreasWithInequalitiesData,
  getInequalityCategories,
  getInequalitiesType,
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

interface InequalitiesTrendProps {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  measurementUnit?: string;
  dataSource?: string;
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
