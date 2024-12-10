import { LineChart } from "@/components/pages/chart";
import Highcharts from "highcharts";

export default async function LineChartPage(
) {
    const lineChartData: Highcharts.Options = {
        chart: { type: 'line' },
        title: { text: 'Line Chart Example' },
        xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
        series: [{ type: 'line', name: 'Monitored value', data: [2, 2, 3, 6, 5, 6] }],
    };

    return <LineChart options={lineChartData} />;
}