import Highcharts from "highcharts";
import {HighchartsReact} from "highcharts-react-official";


export type Forecast = {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
};

interface LineChartProps{
    data: Forecast[];
    title?: string;
    xAxisTitle?: string;
    yAxisTitle?: string;
}

export function LineChart({data, title = 'Weather Forecast', xAxisTitle = 'Date', yAxisTitle = 'Temperature (°C)'}: LineChartProps){
    const categories = data.map((item) => item.date);
    const temperatureData = data.map((item) => item.temperatureC);

    const lineChartOptions: Highcharts.Options = {
        chart: { type: 'line' },
        title: { text: title }, 
        xAxis: {
            categories: categories, 
            title: { text: xAxisTitle } 
        },
        yAxis: {
            title: { text: yAxisTitle } 
        },
        series: [
            {
                type: 'line',
                name: yAxisTitle, 
                data: temperatureData,
            },
        ],
        accessibility: {
            enabled: true,
            description: 'A line chart showing temperature data over time.',
        },
    };
    
    return <HighchartsReact highcharts={Highcharts} options={lineChartOptions}/>
}