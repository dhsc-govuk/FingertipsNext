'use client';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useMemo } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '@/components/layouts/tabContainer';
import { SelectInputField } from '../molecules/SelectInputField';
import { AreaDocument } from '@/lib/search/searchTypes';

const filterHealthDataForArea = (
  dataForAreas: HealthDataForArea[],
  areaCodes: string[]
) => {
  const areas = dataForAreas.filter((area: HealthDataForArea, _: number) => {
    return areaCodes.includes(area.areaCode);
  });

  const england = dataForAreas.find((area: HealthDataForArea, _: number) => {
    return (
      area.areaCode == areaCodeForEngland && !areaCodes.includes(area.areaCode)
    );
  });

  let baseline: HealthDataForArea | undefined = undefined;
  if (england) {
    baseline = dataForAreas.find((area: HealthDataForArea, _: number) => {
      return (
        !areaCodes.includes(area.areaCode) && england.areaCode != area.areaCode
      );
    });
  }
  return { areas, england, baseline };
};

interface PyramidPopulationChartViewProps {
  populationHealthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
}

export const PyramidPopulationChartView = ({
  populationHealthDataForAreas,
  xAxisTitle,
  yAxisTitle,
}: PyramidPopulationChartViewProps) => {
  const areaCodesSelected = populationHealthDataForAreas.map(
    (area) => area.areaCode
  );
  const convertedData = ((
    dataAreas: HealthDataForArea[],
    areaCodes: string[]
  ) => {
    const { areas, england, baseline } = filterHealthDataForArea(
      dataAreas,
      areaCodes
    );

    const pyramidAreas = areas.map((area) =>
      convertHealthDataForAreaForPyramidData(area)
    );
    const pyramidEngland = convertHealthDataForAreaForPyramidData(england);
    const pyramidBaseline = convertHealthDataForAreaForPyramidData(baseline);
    return {
      areas: pyramidAreas,
      england: pyramidEngland,
      baseline: pyramidBaseline,
    };
  })(populationHealthDataForAreas, areaCodesSelected);

  if (convertedData.areas?.length === 0) {
    return <></>;
  }

  const selectedArea: PopulationDataForArea = convertedData
    .areas[0] as PopulationDataForArea;
  return (
    <div>
      <div>
        <h1>Related Population Data</h1>
        <button>Close</button>
        <div>
          <SelectInputField
            title="Select an area"
            areas={populationHealthDataForAreas.map(
              (healthData: HealthDataForArea, _: number) => {
                return {
                  areaCode: healthData.areaCode,
                  areaName: healthData.areaName,
                };
              }
            )}
            onSelected={(area: Omit<AreaDocument, 'areaType'>) => {}}
          />
        </div>
      </div>
      <TabContainer
        id="pyramidChartAndTableView"
        items={[
          {
            id: 'populationPyramidChart',
            title: 'Population pyramid',
            content: (
              <PopulationPyramid
                dataForSelectedArea={selectedArea}
                dataForBaseline={convertedData.baseline}
                dataForEngland={convertedData.england}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            ),
          },
          {
            id: 'populationPyramidTable',
            title: 'Table',
            content: <div>The table here</div>,
          },
        ]}
      />
    </div>
  );
};
