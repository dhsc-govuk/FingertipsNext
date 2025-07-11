import { ThematicMap } from '@/components/charts/ThematicMap/ThematicMap';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { SearchParams } from '@/lib/searchStateManager';
import { useCompareAreasTableData } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData';
import { determineAreaCodes } from '@/lib/chartHelpers/chartHelpers';
import { useApiAvailableAreas } from '@/components/charts/hooks/useApiAvailableAreas';

export function ThematicMapWrapper() {
  const searchState = useSearchStateParams();
  const { availableAreas } = useApiAvailableAreas();
  const data = useCompareAreasTableData();

  if (!data) return null;

  const {
    englandData,
    groupData,
    indicatorMetaData,
    benchmarkComparisonMethod,
    benchmarkToUse,
    polarity,
    healthIndicatorData,
  } = data;

  const {
    [SearchParams.GroupAreaSelected]: selectedGroupArea,
    [SearchParams.AreaTypeSelected]: selectedAreaType,
    [SearchParams.AreasSelected]: areasSelected,
  } = searchState;

  const areaCodes = determineAreaCodes(
    areasSelected,
    selectedGroupArea,
    availableAreas
  );

  return (
    <StyleChartWrapper>
      <ThematicMap
        selectedAreaType={selectedAreaType}
        healthIndicatorData={healthIndicatorData}
        benchmarkComparisonMethod={
          benchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown
        }
        polarity={polarity ?? IndicatorPolarity.Unknown}
        indicatorMetadata={indicatorMetaData}
        groupData={groupData}
        englandData={englandData}
        areaCodes={areaCodes ?? []}
        benchmarkToUse={benchmarkToUse}
      />
    </StyleChartWrapper>
  );
}
