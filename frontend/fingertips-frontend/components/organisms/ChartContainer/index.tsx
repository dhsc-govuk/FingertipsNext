'use client';
import { Tabs } from 'govuk-react';
import React, { useState } from 'react';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { LineChart } from '../LineChart';
import { LineChartTable } from '../LineChartTable';

interface ChartProps {
  healthData: HealthDataForArea[];
  benchmarkData?: HealthDataForArea;
}

export const ChartContainer = ({ healthData, benchmarkData }: ChartProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleClick = (index: number) => {
    setTabIndex(index);
  };

  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab
          onClick={(_) => handleClick(0)}
          href="#"
          selected={tabIndex === 0}
        >
          Line Chart
        </Tabs.Tab>
        <Tabs.Tab
          onClick={(_) => handleClick(1)}
          href="#"
          selected={tabIndex === 1}
        >
          Tabular Data
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel selected={tabIndex === 0}>
        <LineChart
          LineChartTitle="See how the indicator has changed over time"
          data={healthData}
          benchmarkData={benchmarkData}
          xAxisTitle="Year"
          accessibilityLabel="A line chart showing healthcare data"
        />
      </Tabs.Panel>
      <Tabs.Panel selected={tabIndex === 1}>
        <LineChartTable
          data={healthData[0]}
          englandBenchmarkData={benchmarkData}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
