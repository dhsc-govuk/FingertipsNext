'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useCallback, useMemo, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  createPopulationDataFrom,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { TabContainer } from '@/components/layouts/tabContainer';
import {
  AreaSelectInputData,
  AreaSelectInputField,
} from '@/components/molecules/SelectInputField';
import { HeaderChartTitle } from './HeaderChartTitle';
import { H3 } from 'govuk-react';
import { getLatestYear } from '@/lib/chartHelpers/colours';

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
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
    (area: AreaSelectInputData) => {
      if (healthDataForAreas) {
        const healthData = healthDataForAreas.find(
          (healthArea: HealthDataForArea, _: number) => {
            return (
              healthArea.areaCode === area.areaCode &&
              area.areaName === healthArea.areaName
            );
          }
        );

        // change the title.
        const year = getLatestYear(healthData?.healthData);
        let title = undefined;
        if (!year) {
          title = `Resident population profile for ${healthData?.areaName}`;
        } else {
          title = `Resident population profile for ${healthData?.areaName} ${year}`;
        }
        setTitle(title);
        setSelectedArea(convertHealthDataForAreaForPyramidData(healthData));
      }
    },
    [healthDataForAreas]
  );

  if (!convertedData?.areas.length) {
    return <></>;
  }
  return (
    <div>
      <H3>Related Population Data</H3>
      <ShowHideContainer summary="Show" open={false}>
        <div>
          <div>
            <AreaSelectInputField
              title="Select an area"
              areas={convertedData?.areas.map(
                (healthData: PopulationDataForArea | undefined, _: number) => {
                  return {
                    areaCode: healthData?.areaCode,
                    areaName: healthData?.areaName,
                  } as AreaSelectInputData;
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
