import { LineChart } from '@/components/pages/chart';
import {connection} from "next/server";

async function fetchLineChartData() {
  // We don't want to render this page statically
  await connection();
  
  const response = await fetch('http://localhost:5144/weatherforecast', {
    // Cache the data for 60s
    next: { revalidate: 60 },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }
  return await response.json();
}

export default async function getLineChartData() {
  const data = await fetchLineChartData();

  if (!data) {
    return <div>Failed to load data.</div>;
  }

  return <LineChart data={data}></LineChart>;
}
