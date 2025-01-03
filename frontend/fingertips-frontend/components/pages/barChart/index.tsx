'use client'
import { H1 } from 'govuk-react';
import { BarChart } from '@/components/organisms/BarChart';

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

export function Bar({data} : Readonly<BarChartProps>) {
  return (
    <>
    <H1>Bar Chart</H1>
      <BarChart data={data}></BarChart>
    </>
  )
}