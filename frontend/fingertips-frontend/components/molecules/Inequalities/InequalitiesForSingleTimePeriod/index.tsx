import { TabContainer } from '@/components/layouts/tabContainer';
import { H4 } from 'govuk-react';
import { TimePeriodDropDown } from '../../TimePeriodDropDown';
import { InequalitiesBarChart } from '../BarChart';
import { InequalitiesBarChartTable } from '../BarChart/Table';
import {
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import {
  BenchmarkComparisonMethod,
  HealthDataForArea,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea;
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
  const { [SearchParams.YearSelected]: selectedYear } = searchState;
  const type = InequalitiesTypes.Sex;
  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(
      groupHealthDataByYear(healthIndicatorData.healthData),
      type
    );

  const yearsDesc = Object.keys(
    yearlyHealthDataGroupedByInequalities
  ).reverse();

  const barChartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: mapToInequalitiesTableData(
      yearlyHealthDataGroupedByInequalities
    ).find((data) => data.period === Number(selectedYear ?? yearsDesc[0]))!,
  };
  return (
    <div data-testid="inequalitiesForSingleTimePeriod-component">
      <H4>Inequalities data for a single time period</H4>
      <TimePeriodDropDown years={yearsDesc} searchState={searchState} />
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
