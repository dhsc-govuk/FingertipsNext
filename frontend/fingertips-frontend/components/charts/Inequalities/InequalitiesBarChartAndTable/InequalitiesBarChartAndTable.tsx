import { TabContainer } from '@/components/layouts/tabContainer';
import { H3 } from 'govuk-react';
import { TimePeriodDropDown } from '../../../molecules/TimePeriodDropDown';
import { InequalitiesBarChart } from '../InequalitiesBarChart/InequalitiesBarChart';
import { InequalitiesBarChartTable } from '@/components/charts/Inequalities/InequalitiesBarChartTable/InequalitiesBarChartTable';
import { SearchParams } from '@/lib/searchStateManager';
import { ChartSelectArea } from '../../../molecules/ChartSelectArea';
import { InequalitiesTypesDropDown } from '../InequalitiesTypesDropDown';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';

import { useInequalitiesData } from '@/components/charts/Inequalities/hooks/useInequalitiesData';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import {
  chartTitleConfig,
  ChartTitleKeysEnum,
} from '@/lib/ChartTitles/chartTitleEnums';

export function InequalitiesBarChartAndTable() {
  const data = useInequalitiesData();
  const { indicatorMetaData } = useIndicatorMetaData();
  if (!data || !indicatorMetaData) return null;

  const { dataSource } = indicatorMetaData;

  const {
    chartTitle,
    barChartData,
    periodsDesc,
    inequalityCategories,
    availableAreasWithInequalities,
    type,
    inequalityType,
    benchmarkMethod,
    polarity,
  } = data;

  return (
    <StyleChartWrapper data-testid="inequalitiesComparisonForOneTimePeriod-component">
      <H3 id={ChartTitleKeysEnum.InequalitiesBarChart}>
        {chartTitleConfig[ChartTitleKeysEnum.InequalitiesBarChart].title}
      </H3>
      <TimePeriodDropDown periods={periodsDesc} />
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
      {barChartData ? (
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
                  measurementUnit={indicatorMetaData?.unitLabel}
                  type={type}
                  yAxisLabel="Value"
                  benchmarkComparisonMethod={benchmarkMethod}
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
                  indicatorMetadata={indicatorMetaData}
                  type={type}
                  benchmarkComparisonMethod={benchmarkMethod}
                  polarity={polarity}
                  inequalityTypeSelected={inequalityType}
                />
              ),
            },
          ]}
          footer={<DataSource dataSource={dataSource} />}
        />
      ) : null}
    </StyleChartWrapper>
  );
}
