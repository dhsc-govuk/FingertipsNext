import { Heatmap } from '@/components/organisms/Heatmap';
import { area, indicator } from '@/components/organisms/Heatmap/heatmapUtil';
import { HealthDataPoint } from '@/generated-sources/ft-api-client';

const indicatorData = () => {
  const newHealthDataPoint = ({
    year,
    value,
  }: {
    year: number;
    value?: number;
  }): HealthDataPoint => {
    return {
      year: year,
      value: value,
      ageBand: '',
      sex: '',
      trend: 'Not yet calculated',
    };
  };

  const indicator1: indicator = {
    id: 'indicator1',
    name: 'Rate of walkers tripping over sheep',
    unitLabel: 'per 100',
    latestDataPeriod: 1066,
  };
  const indicator2: indicator = {
    id: 'indicator2',
    name: 'Donkey / Goose ratio',
    unitLabel: '%',
    latestDataPeriod: 1812,
  };

  const areaEngland: area = { code: 'E92000001', name: 'England' };
  const area2: area = { code: 'area2', name: 'Garsdale' };
  const area3: area = { code: 'area3', name: 'Dentdale' };
  const area4: area = {
    code: 'area4',
    name: 'Comedically Long Area Name with a Devilishly Difficult Distance to Display',
  };

  const data: HealthDataPoint[][][] = [
    [
      [
        newHealthDataPoint({ year: 1, value: 11 }),
        newHealthDataPoint({ year: 2, value: 12 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 21 }),
        newHealthDataPoint({ year: 2, value: 22 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 31 }),
        newHealthDataPoint({ year: 2, value: 32 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 41 }),
        newHealthDataPoint({ year: 2, value: 42 }),
      ],
    ],
    [
      [
        newHealthDataPoint({ year: 1, value: 111 }),
        newHealthDataPoint({ year: 2, value: 112 }),
      ],
      [newHealthDataPoint({ year: 1, value: 121 })],
      [
        newHealthDataPoint({ year: 1, value: 131 }),
        newHealthDataPoint({ year: 2, value: 132 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 141 }),
        newHealthDataPoint({ year: 2, value: 142 }),
      ],
    ],
  ];

  return [
    {
      indicatorId: indicator1.id,
      indicatorName: indicator1.name,
      unitLabel: indicator1.unitLabel,
      healthDataForAreas: [
        {
          areaCode: areaEngland.code,
          areaName: areaEngland.name,
          healthData: data[0][0],
        },
        {
          areaCode: area2.code,
          areaName: area2.name,
          healthData: data[0][1],
        },
        {
          areaCode: area3.code,
          areaName: area3.name,
          healthData: data[0][2],
        },
        {
          areaCode: area4.code,
          areaName: area4.name,
          healthData: data[0][3],
        },
      ],
    },
    {
      indicatorId: indicator2.id,
      indicatorName: indicator2.name,
      unitLabel: indicator2.unitLabel,
      healthDataForAreas: [
        {
          areaCode: areaEngland.code,
          areaName: areaEngland.name,
          healthData: data[1][0],
        },
        {
          areaCode: area2.code,
          areaName: area2.name,
          healthData: data[1][1],
        },
        {
          areaCode: area3.code,
          areaName: area3.name,
          healthData: data[1][2],
        },
        {
          areaCode: area4.code,
          areaName: area4.name,
          healthData: data[1][3],
        },
      ],
    },
  ];
};

// TODO delete this, put in views
export default function HeatmapPage() {
  return <Heatmap indicatorData={indicatorData()} />;
}
