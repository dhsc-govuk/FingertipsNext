import { InequalitiesBarChartTable } from '@/components/molecules/Inequalities/BarChart/Table';
import { InequalitiesLineChartTable } from '@/components/molecules/Inequalities/LineChart/Table';
import { InequalitiesBarChart } from '@/components/molecules/Inequalities/BarChart';
import { InequalitiesLineChart } from '@/components/molecules/Inequalities/LineChart';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import React, { useState } from 'react';
import {
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesChartData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
} from './inequalitiesHelpers';
import { H4, H5, Select } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import styled from 'styled-components';

interface InequalitiesProps {
  healthIndicatorData: HealthDataForArea;
  searchState: SearchStateParams;
  type?: InequalitiesTypes;
  measurementUnit?: string;
}

const StyledSelect = styled(Select)({
  width: '25em',
  marginBottom: '3em',
});

export function Inequalities({
  healthIndicatorData,
  measurementUnit,
  searchState,
  type = InequalitiesTypes.Sex,
}: Readonly<InequalitiesProps>) {
  const yearlyHealthdata = groupHealthDataByYear(
    healthIndicatorData.healthData
  );

  const { [SearchParams.AreasSelected]: areasSelected } = searchState;

  const yearlyHealthDataGroupedByInequalities =
    getYearDataGroupedByInequalities(yearlyHealthdata);

  const dynamicKeys = getDynamicKeys(
    yearlyHealthDataGroupedByInequalities,
    type
  );

  const lineChartData: InequalitiesChartData = {
    areaName: healthIndicatorData.areaName,
    rowData: mapToInequalitiesTableData(yearlyHealthDataGroupedByInequalities),
  };

  const yearsDesc = Object.keys(yearlyHealthdata).reverse();
  const [selectedYear, setSelectedYear] = useState<string>(yearsDesc[0]);

  const selectedYearData = lineChartData.rowData.find(
    (data) => data.period === Number(selectedYear)
  );

  const barchartData: InequalitiesBarChartData = {
    areaName: healthIndicatorData.areaName,
    data: selectedYearData!,
  };

  return (
    <div data-testid="inequalities-component">
      <H4>Inequalities data for a single time period</H4>
      <H5>Select a time period</H5>
      <StyledSelect
        label=""
        input={{
          defaultValue: selectedYear,
          onChange: (e) => {
            setSelectedYear(e.target.value);
          },
        }}
      >
        {yearsDesc.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </StyledSelect>
      <TabContainer
        id="inequalitiesBarChartAndTable"
        items={[
          {
            id: 'inequalitiesBarChart',
            title: 'Bar chart',
            content: (
              <InequalitiesBarChart
                barChartData={barchartData}
                measurementUnit={measurementUnit}
                yAxisLabel="Value"
              />
            ),
          },
          {
            id: 'inequalitiesBarChartTable',
            title: 'Table',
            content: (
              <InequalitiesBarChartTable
                tableData={barchartData}
                measurementUnit={measurementUnit}
                type={type}
              />
            ),
          },
        ]}
      />
      <br />
      <H4>Inequalities data over time</H4>
      <TabContainer
        id="inequalitiesLineChartAndTable"
        items={[
          {
            id: 'inequalitiesLineChart',
            title: 'Line chart',
            content: (
              <InequalitiesLineChart
                lineChartData={lineChartData}
                areasSelected={areasSelected}
                dynamicKeys={dynamicKeys}
                measurementUnit={measurementUnit}
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
