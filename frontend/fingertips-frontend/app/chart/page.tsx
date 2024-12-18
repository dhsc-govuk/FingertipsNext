import { Chart } from '@/components/pages/chart';
import { fetchData } from '@/lib/fetchData';

export default async function ChartPage() {
  const data = await fetchData();

  if (!data) {
    return <div>Failed to load data.</div>;
  }
  
  return <Chart data={data} />;
}
