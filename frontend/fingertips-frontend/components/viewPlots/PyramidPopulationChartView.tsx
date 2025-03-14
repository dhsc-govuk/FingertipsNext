import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PopulationPyramid } from '@/components/organisms/PopulationPyramid';
import { useEffect, useState } from 'react';
import {
  convertHealthDataForAreaForPyramidData,
  PopulationDataForArea,
} from '@/lib/chartHelpers/preparePopulationData';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { TabContainer } from '../layouts/tabContainer';

interface PyramidPopulationChartViewProps {
  populationHealthDataForAreas: HealthDataForArea[];
  selectedAreaCode: string;
  xAxisTitle: string;
  yAxisTitle: string;
}

export const PyramidPopulationChartView = ({
  populationHealthDataForAreas,
  selectedAreaCode,
  xAxisTitle,
  yAxisTitle,
}: PyramidPopulationChartViewProps) => {
  const [
    selectedPopulationHealthDataForArea,
    setSelectedPopulationHealthDataForArea,
  ] = useState<PopulationDataForArea>();
  const [
    selectedPopulationEnglandBenchmarkDataForArea,
    setPopulationEnglandBenchmarkDataForArea,
  ] = useState<PopulationDataForArea | undefined>();
  const [
    selectedPopulationBaselineDataForArea,
    setPopulationBaselineDataForArea,
  ] = useState<PopulationDataForArea | undefined>();
  // we have to transform the data so we can be able to use it in the PopulationPyramid
  // and also
  useEffect(() => {
    const doDataConversion = (dataForAreas: HealthDataForArea[]) => {
      const selectedHealthDataForArea = dataForAreas.find(
        (area: HealthDataForArea, _: number) => {
          return area.areaCode == selectedAreaCode;
        }
      );
      // there are either group data area or just the England Data benchmark here
      const englandBenchmarkDataForArea = dataForAreas.find(
        (area: HealthDataForArea, _: number) => {
          return (
            area.areaCode == areaCodeForEngland &&
            area.areaCode != selectedAreaCode
          );
        }
      );
      let baselineHealthDataForArea: PopulationDataForArea | undefined =
        undefined;
      if (englandBenchmarkDataForArea) {
        const baselineHealthDataForAreas = dataForAreas.filter(
          (area: HealthDataForArea, _: number) => {
            return (
              area.areaCode != selectedAreaCode &&
              englandBenchmarkDataForArea.areaCode != area.areaCode
            );
          }
        );
        baselineHealthDataForArea = convertHealthDataForAreaForPyramidData(
          baselineHealthDataForAreas?.length
            ? baselineHealthDataForAreas[0]
            : undefined
        );
      }

      if (selectedHealthDataForArea) {
        setSelectedPopulationHealthDataForArea(
          convertHealthDataForAreaForPyramidData(selectedHealthDataForArea)
        );
        setPopulationEnglandBenchmarkDataForArea(
          convertHealthDataForAreaForPyramidData(englandBenchmarkDataForArea)
        );
        setPopulationBaselineDataForArea(baselineHealthDataForArea);
      }
    };
    try {
      doDataConversion(populationHealthDataForAreas);
    } catch (error) {
      console.error(error);
    }
  }, [populationHealthDataForAreas, selectedAreaCode]);

  if (!selectedPopulationHealthDataForArea) return <></>;

  return (
    <>
      <TabContainer
        id="pyramidChartAndTableView"
        items={[
          {
            id: 'populationPyramidChart',
            title: 'Population Pyramid',
            content: (
              <PopulationPyramid
                dataForSelectedArea={selectedPopulationHealthDataForArea}
                dataForBaseline={selectedPopulationBaselineDataForArea}
                dataForEngland={selectedPopulationEnglandBenchmarkDataForArea}
                xAxisTitle={xAxisTitle}
                yAxisTitle={yAxisTitle}
              />
            ),
          },
        ]}
      />
    </>
  );
};
