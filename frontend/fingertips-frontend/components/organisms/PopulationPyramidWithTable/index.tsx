'use client';

import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '@/components/layouts/tabContainer';
import { AreaSelectInputField } from '@/components/molecules/SelectInputField';
import { AreaDocument } from '@/lib/search/searchTypes';
import { HeaderChartTitle } from './HeaderChartTitle';

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
const getLatestYear = (
  points: HealthDataPoint[] | undefined
): number | undefined => {
  if (!points || points.length < 1) return undefined;

  const year = points.reduce((previous, point) => {
    return Math.max(previous, point.year);
  }, points[0].year);
  return year;
};

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  selectedGroupAreaCode?: string;
}
export const PopulationPyramidWithTable = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  selectedGroupAreaCode,
}: Readonly<PyramidPopulationChartViewProps>) => {
  const [title, setTitle] = useState<string>();

  const convertedData = useMemo(() => {
    return createPopulationDataFrom(
      healthDataForAreas,
      selectedGroupAreaCode ?? ''
    );
  }, [healthDataForAreas, selectedGroupAreaCode]);

  const [selectedArea, setSelectedArea] = useState(
    convertedData.areas.length > 0 ? convertedData.areas[0] : undefined
  );

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
        setSelectedArea(convertHealthDataForAreaForPyramidData(healthData));
      }
    },
    [healthDataForAreas]
  );

  // Use  this to update the header title when selection is made.
  useEffect(() => {
    console.log('Hello changes');
    const healthDataForArea = healthDataForAreas?.find((area, _) => {
      return (
        selectedArea?.areaCode == area.areaCode &&
        selectedArea?.areaName == area.areaName
      );
    });
    if (!healthDataForArea) {
      setTitle('');
      return;
    }

    const year = getLatestYear(healthDataForArea.healthData);
    let title = undefined;
    if (!year) {
      title = `Resident population profile for ${healthDataForArea.areaName}`;
    } else {
      title = `Resident population profile for ${healthDataForArea.areaName} ${year}`;
    }
    setTitle(title);
  }, [selectedArea, healthDataForAreas]);

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
              visibility={convertedData?.areas.length !== 1}
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
                      <HeaderChartTitle title={title ?? ''} />
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
