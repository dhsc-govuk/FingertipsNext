'use client';

import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SelectedIndicatorsPanel } from '@/components/molecules/SelectedIndicatorsPanel';
import { SearchStateParams } from '@/lib/searchStateManager';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { Button, SectionBreak } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';

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
        <Button
          buttonColour={GovukColours.LightGrey}
          buttonTextColour={GovukColours.Black}
          onClick={changeSelection}>
          Change selection
        </Button>
      </div>

      <SectionBreak visible={true} />
    </div>
  );
};
