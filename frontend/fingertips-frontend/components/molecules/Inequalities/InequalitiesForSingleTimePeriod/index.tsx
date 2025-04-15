import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  filterHealthData,
  getAreasWithInequalitiesData,
  getInequalitiesType,
  getInequalityCategories,
  getYearDataGroupedByInequalities,
  getYearsWithInequalityData,
  groupHealthDataByYear,
  healthDataFilterFunctionGeneratorForInequality,
  InequalitiesBarChartData,
  mapToInequalitiesTableData,
  sequenceSelectorForInequality,
  valueSelectorForInequality,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { ChartSelectArea } from '../../ChartSelectArea';
import {
  determineHealthDataForArea,
  seriesDataWithoutGroup,
} from '@/lib/chartHelpers/chartHelpers';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';
import { DataSource } from '@/components/atoms/DataSource/DataSource';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  dataSource?: string;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  searchState,
  measurementUnit,
  benchmarkComparisonMethod,
  polarity,
  dataSource,
}: Readonly<InequalitiesForSingleTimePeriodProps>) {
  const {
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityBarChartTypeSelected]: inequalityTypeSelected,
    [SearchParams.InequalityBarChartAreaSelected]:
      inequalityBarChartAreaSelected,
  } = searchState;

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthIndicatorData,
    selectedGroupCode,
    true
  );

  const healthDataForArea = determineHealthDataForArea(
    healthdataWithoutGroup,
    inequalityBarChartAreaSelected
  );

  if (!healthDataForArea) return null;

  const inequalityCategories = getInequalityCategories(
    healthDataForArea,
    Number(selectedYear)
  );
  if (!inequalityCategories.length) return null;

  const type = getInequalitiesType(
    inequalityCategories,
    inequalityTypeSelected
  );

  const availableAreasWithInequalities = getAreasWithInequalitiesData(
    healthdataWithoutGroup,
    type,
    selectedYear
  );

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthDataForArea,
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

  const allData = mapToInequalitiesTableData(
    yearlyHealthDataGroupedByInequalities,
    sequenceSelector
  );

  const yearsDesc = getYearsWithInequalityData(allData).reverse();

  if (!yearsDesc.length) return null;

  const periodData = allData.find(
    (data) => data.period === Number(selectedYear ?? yearsDesc[0])
  );

  if (!periodData) throw new Error('data does not exist for selected year');

  const barChartData: InequalitiesBarChartData = {
    areaName: healthDataForArea.areaName,
    data: periodData,
  };
  return (
    <div data-testid="inequalitiesForSingleTimePeriod-component">
      <H3>Inequalities data for a single time period</H3>
      <TimePeriodDropDown years={yearsDesc} searchState={searchState} />
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityBarChartTypeSelected
        }
        testRef="bc"
        searchState={searchState}
      />
      <ChartSelectArea
        availableAreas={availableAreasWithInequalities}
        chartAreaSelectedKey={SearchParams.InequalityBarChartAreaSelected}
        searchState={searchState}
      />
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: (
              <InequalitiesBarChart
                barChartData={barChartData}
                measurementUnit={measurementUnit}
                type={type}
                yAxisLabel="Value"
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
              />
            ),
          },
          {
            id: 'inequalitiesBarChartTable',
            title: 'Table',
            content: (
              <InequalitiesBarChartTable
                tableData={barChartData}
                measurementUnit={measurementUnit}
                type={type}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
              />
            ),
          },
        ]}
        footer={<DataSource dataSource={dataSource} />}
      />
    </div>
  );
}
