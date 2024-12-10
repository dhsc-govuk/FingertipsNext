import { LineChart } from '@/components/pages/chart';

async function fetchLineChartData() {
  const response = await fetch('http://localhost:5144/weatherforecast');
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
