import { Heatmap } from '@/components/organisms/Heatmap';
import { HealthDataPoint } from '@/generated-sources/ft-api-client';

export default function HeatmapPage() {
  return (
    <Heatmap
      indicatorData={placeholderHeatmapData}
      groupAreaCode={placeholderGroupAreaCode}
    />
  );
}

const placeholderGroupAreaCode = 'area3';

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
    deprivation: {
      sequence: 0,
      value: '',
      type: '',
    },
  };
};

interface row {
  key: string;
  cells: cell[];
}

interface cell {
  key: string;
  content: string;
}

const indicator1 = {
  id: 'indicator1',
  name: 'Very Verbose Indicator Name With an Extreeeeeeeme Number of Words to Try And Trip Up The View. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus varius magna massa, commodo consectetur erat hendrerit id. In semper, nibh eu efficitur sagittis, quam lectus semper augue, quis vestibulum ipsum urna ut orci.',
  unitLabel: 'per 1000',
  latestDataPeriod: 2004,
};

const indicator2 = {
  id: 'indicator2',
  name: 'Rate of walkers tripping over sheep',
  unitLabel: 'per 100',
  latestDataPeriod: 2002,
};
const indicator3 = {
  id: 'indicator3',
  name: 'Donkey / Goose ratio',
  unitLabel: '%',
  latestDataPeriod: 2002,
};

const areaEngland = { code: 'E92000001', name: 'England' };
const area2 = { code: 'area2', name: 'Garsdale' };
const area3 = { code: placeholderGroupAreaCode, name: 'Dentdale' };
const area4 = {
  code: 'area4',
  name: 'Comedically Long Area Name with a Devilishly Difficult Distance to Display',
};

const data: HealthDataPoint[][][] = [
  [
    [
      newHealthDataPoint({ year: 2001, value: 11 }),
      newHealthDataPoint({ year: 2000, value: 12 }),
    ],
    [
      newHealthDataPoint({ year: 2002, value: 21 }),
      newHealthDataPoint({ year: 2000, value: 22 }),
    ],
    [
      newHealthDataPoint({ year: 2003, value: 31 }),
      newHealthDataPoint({ year: 2000, value: 32 }),
    ],
    [
      newHealthDataPoint({ year: 2004, value: 41 }),
      newHealthDataPoint({ year: 2000, value: 42 }),
    ],
  ],
  [
    [
      newHealthDataPoint({ year: 2001, value: 111 }),
      newHealthDataPoint({ year: 2002, value: 112 }),
    ],
    [newHealthDataPoint({ year: 2001, value: 121 })],
    [
      newHealthDataPoint({ year: 2001, value: 131 }),
      newHealthDataPoint({ year: 2002, value: 132 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 141 }),
      newHealthDataPoint({ year: 2002, value: 142 }),
    ],
  ],
  [
    [
      newHealthDataPoint({ year: 2001, value: 1111 }),
      newHealthDataPoint({ year: 2002, value: 1112 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1121 }),
      newHealthDataPoint({ year: 2002, value: 1122 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1231 }),
      newHealthDataPoint({ year: 2002, value: 1132 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1141 }),
      newHealthDataPoint({ year: 2002, value: 1142 }),
    ],
  ],
];

const placeholderHeatmapData = [
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
  {
    indicatorId: indicator3.id,
    indicatorName: indicator3.name,
    unitLabel: indicator3.unitLabel,
    healthDataForAreas: [
      {
        areaCode: areaEngland.code,
        areaName: areaEngland.name,
        healthData: data[2][0],
      },
      {
        areaCode: area2.code,
        areaName: area2.name,
        healthData: data[2][1],
      },
      {
        areaCode: area3.code,
        areaName: area3.name,
        healthData: data[2][2],
      },
      {
        areaCode: area4.code,
        areaName: area4.name,
        healthData: data[2][3],
      },
    ],
  },
];
