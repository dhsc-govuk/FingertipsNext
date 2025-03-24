'use client';

import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SelectedIndicatorsPanel } from '@/components/molecules/SelectedIndicatorsPanel';
import { SearchStateParams } from '@/lib/searchStateManager';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';

export interface FilterSummaryPanelProps {
  selectedAreasData: AreaWithRelations[];
  selectedIndicatorsData: IndicatorDocument[];
  searchState?: SearchStateParams;
  changeSelection?: () => void;
}

export const FilterSummaryPanel = ({
  selectedAreasData,
  selectedIndicatorsData,
  searchState,
  changeSelection,
}: FilterSummaryPanelProps) => {
  return (
    <div>
      <SelectedIndicatorsPanel
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={searchState}
        isViewOnly={true}
      />

      <SelectedAreasPanel
        selectedAreasData={selectedAreasData}
        searchState={searchState}
        isFullWidth={true}
        isViewOnly={true}
        />

      <div>
        <button onClick={changeSelection}>Change selection</button>
      </div>
    </div>
  );
};
