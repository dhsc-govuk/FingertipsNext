import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { H3 } from 'govuk-react';
import { InequalitiesTypesDropDown } from '@/components/charts/Inequalities/InequalitiesTypesDropDown';
import { SearchParams } from '@/lib/searchStateManager';
import { ChartSelectArea } from '@/components/molecules/ChartSelectArea';
import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { InequalitiesTrendTable } from '@/components/charts/Inequalities/InequalitiesTrendTable/InequalitiesTrendTable';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { useInequalitiesData } from '@/components/charts/Inequalities/hooks/useInequalitiesData';
import { useIndicatorMetaData } from '@/components/charts/hooks/useIndicatorMetaData';
import { ChartType } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { ChartTitlesEnum } from '@/lib/ChartTitles/chartTitleEnums';

export function InequalitiesTrendChartAndTable() {
  const data = useInequalitiesData(ChartType.Trend);
  const { indicatorMetaData } = useIndicatorMetaData();
  if (!data || !indicatorMetaData) return null;

  const { dataSource } = indicatorMetaData;

  const {
    inequalityCategories,
    availableAreasWithInequalities,
    inequalityType,
    lineChartData,
    inequalitiesLineChartOptions,
    orderedDynamicKeys,
  } = data;

  if (!inequalitiesLineChartOptions || !lineChartData) return null;

  return (
    <StyleChartWrapper data-testid="inequalitiesTrend-component">
      <H3 id="inequalities-line-chart">
        {ChartTitlesEnum.InequalitiesLineChart}
      </H3>
      <InequalitiesTypesDropDown
        inequalitiesOptions={inequalityCategories}
        inequalityTypeSelectedSearchParam={
          SearchParams.InequalityLineChartTypeSelected
        }
        testRef="lc"
      />
      <ChartSelectArea
        availableAreas={availableAreasWithInequalities}
        chartAreaSelectedKey={SearchParams.InequalityLineChartAreaSelected}
      />
      <TabContainer
        id="inequalitiesLineChartAndTable"
        items={[
          {
            id: 'inequalitiesLineChart',
            title: 'Line chart',
            content: (
              <LineChart
                title={inequalitiesLineChartOptions.title?.text ?? ''}
                lineChartOptions={inequalitiesLineChartOptions}
                variant={LineChartVariant.Inequalities}
              />
            ),
          },
          {
            id: 'inequalitiesLineChartTable',
            title: 'Table',
            content: (
              <InequalitiesTrendTable
                title={inequalitiesLineChartOptions.title?.text ?? ''}
                tableData={lineChartData}
                indicatorMetadata={indicatorMetaData}
                dynamicKeys={orderedDynamicKeys}
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
