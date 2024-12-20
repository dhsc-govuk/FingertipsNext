import { BarChart } from '@/components/barChartOptions';
import { fetchData } from '@/lib/fetchData';

export default async function BarChartPage() {
  const data = await fetchData();

  if (!data) {
    return <div>Failed to load data.</div>;
  }
  return <BarChart data={data} />;
}
