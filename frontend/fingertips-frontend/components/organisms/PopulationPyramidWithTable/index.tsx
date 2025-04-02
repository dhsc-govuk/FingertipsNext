'use client';

import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useCallback, useMemo, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  createPyramidPopulationDataFrom,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { TabContainer } from '@/components/layouts/tabContainer';
import {
  AreaSelectInputData,
  AreaSelectInputField,
} from '@/components/molecules/SelectInputField';
import { HeaderChartTitle } from './HeaderChartTitle';
import { H3 } from 'govuk-react';
import { getLatestYear } from '@/lib/chartHelpers/chartHelpers';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';

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

const getSelectedAreaFrom = (
  areaCode: string | undefined,
  convertedData: (PopulationDataForArea | undefined)[]
) => {
  let populationArea: PopulationDataForArea | undefined = undefined;
  if (areaCode && convertedData.length > 0) {
    populationArea = convertedData.find(
      (area: PopulationDataForArea | undefined) => area?.areaCode === areaCode
    );
  }
  if (!populationArea)
    return convertedData.length > 0 ? convertedData[0] : undefined;
  return populationArea;
};

interface PyramidPopulationChartViewProps {
  healthDataForAreas: HealthDataForArea[];
  groupAreaSelected?: string;
  xAxisTitle: string;
  yAxisTitle: string;
  searchState: SearchStateParams;
}
export const PopulationPyramidWithTable = ({
  healthDataForAreas,
  xAxisTitle,
  yAxisTitle,
  groupAreaSelected,
  searchState,
}: Readonly<PyramidPopulationChartViewProps>) => {
  const stateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.PopulationAreaSelected]: areaCode } =
    stateManager.getSearchState();

  const [selectedAreaCode, setSelectedAreaCode] = useState<string | undefined>(
    areaCode
  );

  const pathname = usePathname();
  const { replace } = useRouter();

  const convertedData = useMemo(() => {
    return createPyramidPopulationDataFrom(
      healthDataForAreas,
      groupAreaSelected ?? ''
    );
  }, [healthDataForAreas, groupAreaSelected]);

  const [selectedArea, setSelectedArea] = useState(
    getSelectedAreaFrom(selectedAreaCode, convertedData.areas)
  );

  const [title, setTitle] = useState<string>(
    (() => {
      if (!selectedArea) return '';
      const healthData = healthDataForAreas.find(
        (value: HealthDataForArea, _: number) => {
          return (
            value.areaCode == selectedArea.areaCode &&
            value.areaName == selectedArea.areaName
          );
        }
      );
      const year = getLatestYear(healthData?.healthData);
      return getHeaderTitle(healthData, year);
    })()
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
        const year = getLatestYear(healthData?.healthData);
        stateManager.removeParamValueFromState(
          SearchParams.PopulationAreaSelected
        );
        stateManager.addParamValueToState(
          SearchParams.PopulationAreaSelected,
          area.areaCode
        );

        setTitle(getHeaderTitle(healthData, year));
        setSelectedArea(
          convertHealthDataForAreaForPyramidData(healthData, year)
        );
        setSelectedAreaCode(area.areaCode);
        replace(stateManager.generatePath(pathname));
      }
    },
    [healthDataForAreas, stateManager, replace, pathname]
  );

  if (!convertedData?.areas.length) {
    return <></>;
  }

  return (
    <div data-testid="populationPyramidWithTable-component">
      <H3 style={{ fontSize: '24px' }}>Related Population Data</H3>
      <ArrowExpander
        openTitle="Show population data"
        closeTitle="Hide population data"
        open={
          selectedAreaCode != undefined &&
          selectedAreaCode === selectedArea?.areaCode
        }
      >
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
      </ArrowExpander>
    </div>
  );
};
