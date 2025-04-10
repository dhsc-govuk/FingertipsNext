import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  filterHealthData,
  getAreasWithSexInequalitiesData,
  getInequalityCategory,
  getYearDataGroupedByInequalities,
  getYearsWithInequalityData,
  groupHealthDataByYear,
  healthDataFilterFunctionGeneratorForInequality,
  InequalitiesBarChartData,
  InequalitiesTypes,
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
import { seriesDataWithoutGroup } from '@/lib/chartHelpers/chartHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea[];
  searchState: SearchStateParams;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  searchState,
  measurementUnit,
  benchmarkComparisonMethod,
  polarity,
}: Readonly<InequalitiesForSingleTimePeriodProps>) {
  const {
    // [SearchParams.AreasSelected]: areasSelected,
    [SearchParams.GroupSelected]: selectedGroupCode,
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityTypeSelected]: inequalityTypeSelected,
    [SearchParams.InequalityBarChartAreaSelected]:
      inequalityBarChartAreaSelected,
  } = searchState;

  const healthdataWithoutGroup = seriesDataWithoutGroup(
    healthIndicatorData,
    selectedGroupCode,
    true
  );

  const availableAreasWithInequalities =
    inequalityTypeSelected === 'sex' || inequalityTypeSelected === undefined
      ? getAreasWithSexInequalitiesData(healthdataWithoutGroup, selectedYear)
      : [];

  // const isInequalityBarChartAreaSelectedValid =
  //   inequalityBarChartAreaSelected &&
  //   areasSelected?.includes(inequalityBarChartAreaSelected);

  const areaToUse =
    inequalityBarChartAreaSelected ??
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
    ...healthDataForArea,
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
      />
    </div>
  );
}
