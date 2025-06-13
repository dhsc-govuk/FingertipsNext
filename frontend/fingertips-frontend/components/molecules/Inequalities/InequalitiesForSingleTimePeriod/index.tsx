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
import { SearchParams } from '@/lib/searchStateManager';
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
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface InequalitiesForSingleTimePeriodProps {
  healthIndicatorData: HealthDataForArea[];
  indicatorMetadata?: IndicatorDocument;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
  dataSource?: string;
}

export function InequalitiesForSingleTimePeriod({
  healthIndicatorData,
  indicatorMetadata,
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
  } = useSearchStateParams();

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

  // If the user has made no selection of inequality type to display yet, use
  // the default inequality category
  const inequalityType = inequalityTypeSelected ?? inequalityCategories[0];

  const filterFunctionGenerator =
    healthDataFilterFunctionGeneratorForInequality[type];
  const healthIndicatorDataWithoutOtherInequalities = {
    ...healthDataForArea,
    healthData: filterHealthData(
      healthDataForArea.healthData,
      filterFunctionGenerator(inequalityType)
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

  const dataPeriod = Number(selectedYear ?? yearsDesc[0]);
  const periodData = allData.find((data) => data.period === dataPeriod);

  if (!periodData) throw new Error('data does not exist for selected year');

  const barChartData: InequalitiesBarChartData = {
    areaCode: healthDataForArea.areaCode,
    areaName: healthDataForArea.areaName,
    data: periodData,
  };

  const chartTitle = `${indicatorMetadata?.indicatorName ?? ''} inequalities for ${healthDataForArea.areaName}, ${dataPeriod}`;

  return (
    <StyleChartWrapper data-testid="inequalitiesForSingleTimePeriod-component">
      <H3>Inequalities data for a single time period</H3>
      <TimePeriodDropDown years={yearsDesc} />
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityBarChartTypeSelected
        }
        testRef="bc"
      />
      <ChartSelectArea
        availableAreas={availableAreasWithInequalities}
        chartAreaSelectedKey={SearchParams.InequalityBarChartAreaSelected}
      />
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: (
              <InequalitiesBarChart
                title={chartTitle}
                barChartData={barChartData}
                measurementUnit={indicatorMetadata?.unitLabel}
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
                title={chartTitle}
                tableData={barChartData}
                indicatorMetadata={indicatorMetadata}
                type={type}
                benchmarkComparisonMethod={benchmarkComparisonMethod}
                polarity={polarity}
                inequalityTypeSelected={inequalityType}
              />
            ),
          },
        ]}
        footer={<DataSource dataSource={dataSource} />}
      />
    </StyleChartWrapper>
  );
}
