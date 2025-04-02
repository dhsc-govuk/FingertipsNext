import { TabContainer } from '@/components/layouts/tabContainer';
import { H4 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  filterHealthData,
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
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { useSearchState } from '@/context/SearchStateContext';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea;
  measurementUnit?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod,
  polarity,
}: Readonly<InequalitiesForSingleTimePeriodProps>) {
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();
  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.InequalityYearSelected]: selectedYear,
    [SearchParams.InequalityTypeSelected]: inequalityTypeSelected,
  } = stateManager.getSearchState();

  // This will be updated when we add the dropdown to select inequality types
  const type =
    inequalityTypeSelected === 'deprivation'
      ? InequalitiesTypes.Deprivation
      : InequalitiesTypes.Sex;

  const inequalityCategory = getInequalityCategory(type, healthIndicatorData);

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthIndicatorData,
    healthData: filterHealthData(
      healthIndicatorData.healthData,
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
      <H4>Inequalities data for a single time period</H4>
      <TimePeriodDropDown years={yearsDesc} />
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
