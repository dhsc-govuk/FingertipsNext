'use client';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
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
  defaultSelectedAreaCode?: string;
  currentDate?: Date;
}
export const PyramidPopulationChartView = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  currentDate,
  defaultSelectedAreaCode,
  selectedGroupAreaCode,
}: Readonly<PyramidPopulationChartViewProps>) => {

  const convertedData = useMemo(() => {
    return createPopulationDataFrom(
      healthDataForAreas,
      selectedGroupAreaCode ?? ''
    );
  }, [healthDataForAreas, selectedGroupAreaCode]);

  const defaultArea = convertedData.areas.find((area, _) => {
    return area?.areaCode === defaultSelectedAreaCode;
  });
  const [selectedArea, setSelectedPopulationForArea] = useState(defaultArea);

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
                          {' ' +
                            (currentDate ? currentDate?.getFullYear() : '')}
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
