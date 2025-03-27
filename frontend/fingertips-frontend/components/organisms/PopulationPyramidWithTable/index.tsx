'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  createPyramidPopulationDataFrom,
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
import { getLatestYear } from '@/lib/chartHelpers/chartHelpers';
import { SearchParams, SearchStateManager, SearchStateParams } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';


const getHeaderTitle = (
  healthData: HealthDataForArea | undefined,
  year: number | undefined
): string => {
  let title = undefined;
  if (!year) {
    title = `Resident population profile for ${healthData?.areaName}`;
  } else {
    title = `Resident population profile for ${healthData?.areaName} ${year}`;
  }
  return title;
};

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  xAxisTitle: string;
  yAxisTitle: string;
  searchState: SearchStateParams
}
export const PopulationPyramidWithTable = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  searchState
}: Readonly<PyramidPopulationChartViewProps>) => {

  const stateManager = SearchStateManager.initialise(searchState);
  const {
    [SearchParams.GroupAreaSelected]: selectedGroupAreaCode,
    [SearchParams.PopulationAreaSelected]: selectedAreaCode,
  } = stateManager.getSearchState();

  const pathname = usePathname();
  const { replace } = useRouter();
  const convertedData = useMemo(() => {
    return createPyramidPopulationDataFrom(
      healthDataForAreas,
      selectedGroupAreaCode ?? ''
    );
  }, [healthDataForAreas, selectedGroupAreaCode]);
  // determine the default selected area.
  const getSelectedArea = ((areaCode: string) => {
    let populationArea: PopulationDataForArea | undefined = undefined;
    if (areaCode && convertedData?.areas.length > 0) {
      populationArea = convertedData.areas.find(
        (area: PopulationDataForArea | undefined) => area?.areaCode === areaCode
      );
    }
    if (!populationArea)
      return convertedData?.areas.length > 0
        ? convertedData.areas[0]
        : undefined;
    return populationArea;
  });
  const defaultSelectedArea = getSelectedArea(selectedAreaCode ?? '')
  const [selectedArea, setSelectedArea] = useState(getSelectedArea(selectedAreaCode ?? ''));
  const [title, setTitle] = useState<string>(
    (() => {
      if (!defaultSelectedArea) return '';
      const healthData = healthDataForAreas.find(
        (value: HealthDataForArea, _: number) => {
          return (
            value.areaCode == defaultSelectedArea.areaCode &&
            value.areaName == defaultSelectedArea.areaName
          );
        }
      );
      const year = getLatestYear(healthData?.healthData);
      return getHeaderTitle(healthData, year);
    })()
  );

  //handle the parameter changes and setting the area for now
  useEffect(() => {
    const selectedArea = getSelectedArea(selectedAreaCode ?? '')
    setSelectedArea(selectedArea);
    console.log("Effect on code")
  }, [selectedAreaCode, getSelectedArea])

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

        const year = getLatestYear(healthData?.healthData);
        setTitle(getHeaderTitle(healthData, year));
        setSelectedArea(
          convertHealthDataForAreaForPyramidData(healthData, year)
        );

        stateManager.removeParamValueFromState(SearchParams.PopulationAreaSelected)
        stateManager.addParamValueToState(SearchParams.PopulationAreaSelected, area.areaCode)
        replace(stateManager.generatePath(pathname));

        console.log("Selected area  = " + healthData?.areaCode)
      }
    },
    [healthDataForAreas, stateManager, replace, pathname]
  );

  if (!convertedData?.areas.length) {
    return <></>;
  }
  return (
    <div>
      <H3>Related Population Data</H3>
      <ShowHideContainer summary="Population data" open={selectedAreaCode ? true : false}>
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
                        dataForGroup={convertedData.group}
                        dataForBenchmark={convertedData.benchmark}
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
