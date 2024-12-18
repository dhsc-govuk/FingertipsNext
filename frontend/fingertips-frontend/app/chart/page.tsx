import { LineChart } from '@/components/pages/chart';
import { fetchData } from '@/lib/fetchData';

export default async function ChartPage() {
  const data = await fetchData2();

  if (!data) {
    return <div>Failed to load data.</div>;
  }

  return <LineChart data={data}></LineChart>;
}
