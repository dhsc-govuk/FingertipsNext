'use client';

import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { SelectedIndicatorsPanel } from '@/components/molecules/SelectedIndicatorsPanel';
import { SearchStateParams } from '@/lib/searchStateManager';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { Button, SectionBreak } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

export interface FilterSummaryPanelProps {
  selectedAreasData: AreaWithRelations[] | undefined;
  selectedIndicatorsData: IndicatorDocument[] | undefined;
  searchState?: SearchStateParams;
  changeSelection?: () => void;
}

const StyledSectionBreak = styled(SectionBreak)({
  marginBottom: '1em',
});

/*
Provides a view-only summary of the area filters and selected indicators
 */
export const FilterSummaryPanel = ({
  selectedAreasData,
  selectedIndicatorsData,
  searchState,
  changeSelection,
}: FilterSummaryPanelProps) => {
  return (
    <div
    data-testid='filter-summary-panel'>
      {selectedIndicatorsData ? (
        <SelectedIndicatorsPanel
          selectedIndicatorsData={selectedIndicatorsData}
          searchState={searchState}
          isViewOnly={true}
        />
      ) : null}

      {selectedAreasData ? (
        <SelectedAreasPanel
          selectedAreasData={selectedAreasData}
          searchState={searchState}
          isFullWidth={true}
          isViewOnly={true}
        />
      ) : null}

      <Button
        data-testid='filter-summary-panel-change-selection'
        buttonColour={GovukColours.LightGrey}
        buttonTextColour={GovukColours.Black}
        onClick={changeSelection}
      >
        Change selection
      </Button>

      <StyledSectionBreak visible={true} />
    </div>
  );
};
