'use client';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '@/components/layouts/tabContainer';
import { AreaSelectInputField } from '../molecules/SelectInputField';
import { AreaDocument } from '@/lib/search/searchTypes';

const filterHealthDataForArea = (
  dataForAreas: HealthDataForArea[],
  groupAreaCode: string | undefined
) => {
  let areas = dataForAreas.filter((area: HealthDataForArea, _: number) => {
    return groupAreaCode != area.areaCode;
  });

  const england = dataForAreas.find((area: HealthDataForArea, _: number) => {
    return (
      area.areaCode == areaCodeForEngland && groupAreaCode != area.areaCode
    );
  });

  let baseline: HealthDataForArea | undefined = undefined;
  if (england && groupAreaCode) {
    baseline = dataForAreas.find((area: HealthDataForArea, _: number) => {
      return (
        groupAreaCode == area.areaCode && england.areaCode != area.areaCode
      );
    });
  }

  //removed baseline and england area from the areas
  if (england) {
    areas = areas.filter((area: HealthDataForArea) => {
      return area.areaCode != england.areaCode;
    });
  }

  if (baseline) {
    areas = areas.filter((area: HealthDataForArea) => {
      return area.areaCode != baseline.areaCode;
    });
  }

  return { areas, england, baseline };
};

interface PyramidPopulationChartViewProps {
  populationHealthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
  groupAreaCode: string;
}

export const PyramidPopulationChartView = ({
  populationHealthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  groupAreaCode,
}: PyramidPopulationChartViewProps) => {
  const [toggleClose, setToggleClose] = useState<boolean>();

  const convertedData = ((
    dataAreas: HealthDataForArea[],
    groupAreaCode: string | undefined
  ) => {
    const { areas, england, baseline } = filterHealthDataForArea(
      dataAreas,
      groupAreaCode
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
  })(populationHealthDataForAreas, groupAreaCode);

  const defaultArea = (() => {
    let area =
      convertedData?.areas?.length === 1 ? convertedData?.areas[0] : undefined;
    if (!area) {
      if (convertedData?.areas?.length > 0) {
        area = convertedData?.areas[0];
      }
    }
    return area;
  })();

  const [selectedArea, setSelectedPopulationForArea] = useState<
    PopulationDataForArea | undefined
  >(defaultArea);

  return (
    <div>
      <h1>Related Population Data</h1>
      <button
        onClick={(e) => {
          e.preventDefault();
          setToggleClose(!toggleClose);
        }}
      >
        {toggleClose != true ? 'Close' : 'Open'}
      </button>
      {toggleClose ? null : (
        <div>
          <div>
            <AreaSelectInputField
              title="Select an area"
              areas={convertedData?.areas.map(
                (healthData: PopulationDataForArea | undefined, _: number) => {
                  return {
                    areaCode: healthData?.areaCode,
                    areaName: healthData?.areaName,
                  } as Omit<AreaDocument, 'areaType'>;
                }
              )}
              onSelected={(area: Omit<AreaDocument, 'areaType'>) => {
                if (convertedData.areas) {
                  const selectedArea = convertedData.areas.find(
                    (pArea: PopulationDataForArea | undefined, _: number) => {
                      return pArea?.areaCode == area?.areaCode;
                    }
                  );
                  setSelectedPopulationForArea(selectedArea);
                  console.log(selectedArea);
                }
              }}
              visibility={convertedData?.areas.length === 1 ? false : true}
            />
          </div>
          {selectedArea ? (
            <TabContainer
              id="pyramidChartAndTableView"
              items={[
                {
                  id: 'populationPyramidChart',
                  title: 'Population pyramid',
                  content: (
                    <>
                      <div style={{ margin: '0px', padding: '0px' }}>
                        <h3 style={{ margin: '0px', padding: '0px' }}>
                          Resident Population profile {selectedArea?.areaName}{' '}
                          2024{' '}
                        </h3>
                      </div>

                      <PopulationPyramid
                        dataForSelectedArea={selectedArea}
                        dataForBaseline={convertedData.baseline}
                        dataForEngland={convertedData.england}
                        xAxisTitle={xAxisTitle}
                        yAxisTitle={yAxisTitle}
                      />
                    </>
                  ),
                },
                {
                  id: 'populationPyramidTable',
                  title: 'Table',
                  content: <div>The table here</div>,
                },
              ]}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
