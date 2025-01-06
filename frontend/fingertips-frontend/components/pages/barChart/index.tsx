'use client'
import { H1 } from 'govuk-react';
import { BarChart } from '@/components/organisms/BarChart';
import { BarChartTable } from '@/components/organisms/BarChartTable';

interface HealthCareData {
  areaCode: string;
  healthData: {
    year: number;
    count: number;
    value: number;
    lowerCi: number;
    upperCi: number;
  }[];
}

type BarChartProps = {
  data: HealthCareData[];
}

const headings = ['Area Code', 'Year', 'Count', 'Value', 'LowerCi', 'UpperCi'];

export function Bar({data} : Readonly<BarChartProps>) {
  return (
    <>
    <H1>Bar Chart</H1>
      <BarChart data={data} title="Healthcare Data" xAxisTitle="Value" yAxisTitle="Year"/>
      <BarChartTable data={data} headings={headings}/>
    </>
  )
}