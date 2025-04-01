import { TabContainer } from '@/components/layouts/tabContainer';
import { H4 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  filterHealthData,
  getYearDataGroupedByInequalities,
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
  type?: InequalitiesTypes;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  measurementUnit,
  benchmarkComparisonMethod,
  polarity,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesForSingleTimePeriodProps>) {
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.InequalityYearSelected]: selectedYear } =
    stateManager.getSearchState();

  let inequalityCategory = '';
  if (type == InequalitiesTypes.Deprivation) {
    // This value will ultimately come from the inequality type dropdown
    // For now, we just use the first deprivation type available
    const disaggregatedDeprivationData = filterHealthData(
      healthIndicatorData.healthData,
      (data) => !data.deprivation.isAggregate
    );
    const deprivationTypes = Object.keys(
      Object.groupBy(
        disaggregatedDeprivationData,
        (data) => data.deprivation.type
      )
    );
    inequalityCategory = deprivationTypes[0];
  }

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

  const yearsDesc = Object.keys(
    yearlyHealthDataGroupedByInequalities
  ).reverse();

  const barChartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: mapToInequalitiesTableData(
      yearlyHealthDataGroupedByInequalities,
      sequenceSelector
    ).find((data) => data.period === Number(selectedYear ?? yearsDesc[0]))!,
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
