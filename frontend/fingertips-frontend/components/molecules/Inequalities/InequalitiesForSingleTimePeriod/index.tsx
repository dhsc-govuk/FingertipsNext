import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  filterHealthData,
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
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod,
  polarity,
  searchState,
}: Readonly<InequalitiesForSingleTimePeriodProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityBarChartTypeSelected]: inequalityTypeSelected,
  } = stateManager.getSearchState();

  const inequalityCategories = getInequalityCategories(healthIndicatorData);
  if (!inequalityCategories.length) return null;

  const type = getInequalitiesType(
    inequalityCategories,
    inequalityTypeSelected
  );

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthIndicatorData,
    healthData: filterHealthData(
      healthIndicatorData.healthData,
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

  let selectedYearOverride = undefined;
  if (!yearsDesc.includes(Number(selectedYear))) {
    selectedYearOverride = String(yearsDesc[0]);
  }

  const periodData = allData.find(
    (data) => data.period === Number(selectedYear ?? yearsDesc[0])
  );

  if (!periodData) throw new Error('data does not exist for selected year');

  const barChartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: periodData,
  };
  return (
    <div data-testid="inequalitiesForSingleTimePeriod-component">
      <H3>Inequalities data for a single time period</H3>
      <TimePeriodDropDown
        years={yearsDesc}
        searchState={searchState}
        selectedYearOverride={selectedYearOverride}
      />
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityBarChartTypeSelected
        }
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
