'use client';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useCallback, useMemo, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '@/components/layouts/tabContainer';
import { AreaSelectInputField } from '../molecules/SelectInputField';
import { AreaDocument } from '@/lib/search/searchTypes';

const filterHealthDataForArea = (
  dataForAreas: HealthDataForArea[],
  selectedGroupAreaCode: string | undefined
) => {
  if (dataForAreas.length == 1) {
    return { areas: dataForAreas, england: undefined, baseline: undefined };
  }

  const areas = dataForAreas.filter((area: HealthDataForArea, _: number) => {
    return (
      selectedGroupAreaCode != area.areaCode &&
      area.areaCode != areaCodeForEngland
    );
  });

  const england = dataForAreas.find((area: HealthDataForArea, _: number) => {
    return (
      area.areaCode == areaCodeForEngland &&
      selectedGroupAreaCode != area.areaCode
    );
  });

  let baseline: HealthDataForArea | undefined = undefined;
  if (england && selectedGroupAreaCode) {
    baseline = dataForAreas.find((area: HealthDataForArea, _: number) => {
      return (
        selectedGroupAreaCode == area.areaCode &&
        england.areaCode != area.areaCode
      );
    });
  }

  return { areas, england, baseline };
};

const createPopulationDataFrom = (
  dataForAreas: HealthDataForArea[],
  groupAreaCode: string
) => {
  const { areas, england, baseline } = filterHealthDataForArea(
    dataForAreas,
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
};
interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  selectedGroupAreaCode?: string;
}
export const PyramidPopulationChartView = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  selectedGroupAreaCode,
}: Readonly<PyramidPopulationChartViewProps>) => {
  const [latestYear, setLatestYear] = useState<number>();
  const convertedData = useMemo(() => {
    return createPopulationDataFrom(
      healthDataForAreas,
      selectedGroupAreaCode ?? ''
    );
  }, [healthDataForAreas, selectedGroupAreaCode]);

  const [selectedArea, setSelectedPopulationForArea] = useState(
    convertedData.areas.length === 1 ? convertedData.areas[0] : undefined
  );

  console.log(convertedData);

  const onAreaSelectedHandler = useCallback(
    (area: Omit<AreaDocument, 'areaType'>) => {
      if (healthDataForAreas) {
        const healthData = healthDataForAreas.find(
          (healthArea: HealthDataForArea, _: number) => {
            return (
              healthArea.areaCode === area.areaCode &&
              area.areaName === healthArea.areaName
            );
          }
        );
        // Get the latest of the year in the data point on the selected area.
        if (healthData && healthData.healthData.length > 0) {
          let currentYear = healthData.healthData[0].year;
          healthData.healthData.find((point: HealthDataPoint) => {
            if (point.year > currentYear) {
              currentYear = point.year;
            }
          });
          setLatestYear(currentYear);
        }
        setSelectedPopulationForArea(
          convertHealthDataForAreaForPyramidData(healthData)
        );
      }
    },
    [healthDataForAreas]
  );

  return (
    <div>
      <h1>Related Population Data</h1>
      <ShowHideContainer summary="Open">
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
              onSelected={onAreaSelectedHandler}
              visibility={convertedData?.areas.length === 1 ? false : true}
            />
          </div>
          {selectedArea != undefined ? (
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
                          Resident Population profile {selectedArea?.areaName}
                          {' ' + (latestYear ? latestYear : '')}
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
      </ShowHideContainer>
    </div>
  );
};
