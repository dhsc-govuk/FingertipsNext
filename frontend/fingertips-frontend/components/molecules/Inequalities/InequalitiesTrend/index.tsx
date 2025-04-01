import { TabContainer } from '@/components/layouts/tabContainer';
import { LineChart } from '@/components/organisms/LineChart';
import { LineChartVariant } from '@/components/organisms/LineChart/lineChartHelpers';
import { H4 } from 'govuk-react';
import { InequalitiesLineChartTable } from '../LineChart/Table';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { useState } from 'react';
import {
  generateInequalitiesLineChartOptions,
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesChartData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
  valueSelectorForInequality,
  sequenceSelectorForInequality,
  filterHealthData,
  healthDataFilterFunctionGeneratorForInequality,
} from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { useSearchState } from '@/context/SearchStateContext';

interface InequalitiesTrendProps {
  healthIndicatorData: HealthDataForArea;
  measurementUnit?: string;
  type?: InequalitiesTypes;
}

const generateInequalitiesLineChartTooltipStringList = (
  point: Highcharts.Point,
  symbol: string
) => [
  `<div style="display: flex; margin-top: 7px; align-items: center;"><div style="margin-right: 10px;">
    <span style="color: ${point.series.color}; font-weight: bold;">${symbol}</span></div>`,
  `<div><span>${point.series.name}</br>Value: ${point.y}`,
];

export function InequalitiesTrend({
  healthIndicatorData,
  measurementUnit,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesTrendProps>) {
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.AreasSelected]: areasSelected } =
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

  const [
    showInequalitiesLineChartConfidenceIntervals,
    setShowInequalitiesLineChartConfidenceIntervals,
  ] = useState<boolean>(false);

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

  const lineChartData: InequalitiesChartData = {
    areaName: healthIndicatorData.areaName,
    rowData: mapToInequalitiesTableData(
      yearlyHealthDataGroupedByInequalities,
      sequenceSelector
    ),
  };

  const inequalitiesLineChartOptions: Highcharts.Options =
    generateInequalitiesLineChartOptions(
      lineChartData,
      dynamicKeys,
      type,
      showInequalitiesLineChartConfidenceIntervals,
      generateInequalitiesLineChartTooltipStringList,
      {
        areasSelected,
        yAxisTitleText: 'Value',
        xAxisTitleText: 'Year',
        measurementUnit,
      }
    );

  return (
    <div data-testid="inequalitiesTrend-component">
      <H4>Inequalities data over time</H4>
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
      />
    </div>
  );
}
