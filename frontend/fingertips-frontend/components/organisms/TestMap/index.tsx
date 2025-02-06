'use client';

import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import britishIslesMap from '@highcharts/map-collection/custom/british-isles-all.topo.json';
import { useEffect, useState } from 'react';
import { LoadingBox } from 'govuk-react';

const loadHighchartsModules = async (callback: () => void) => {
  import('highcharts/modules/map').then(callback);
};

export default function Map() {
  const [options, setOptions] = useState<Highcharts.Options>();
  useEffect(() => {
    loadHighchartsModules(async () => {
      setOptions({
        chart: {
          map: britishIslesMap,
          displayErrors: true,
        },
        mapNavigation: {
          enabled: true,
        },
        series: [
          {
            type: 'map',
            data: [
              { name: 'gb-hi', value: 20 },
              { name: 'gb-om', value: 14 },
              { name: 'ie-1510', value: 7 },
              { name: 'gb-ay', value: 11 },
              { name: 'gb-3270', value: 9 },
              { name: 'gb-ab', value: 8 },
              { name: 'gb-ps', value: 4 },
              { name: 'gb-wi', value: 16 },
              { name: 'gb-7398', value: 7 },
            ],
            joinBy: ['hc-key', 'name'],
          },
        ],
      });
    });
  }, []);

  if (!options) {
    return <div>loading...</div>;
  }

  return (
    <>
      <h2>Test Map</h2>

      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={options}
      />
    </>
  );
}
