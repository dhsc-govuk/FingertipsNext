'use client';

import { H1 } from 'govuk-react';
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";

interface optionsProps {
    options: Highcharts.Options;
}

export function LineChart({options}: optionsProps){
    return (
        <>
            <H1>Line Chart</H1>
            <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </div>
        </>
    );
}
