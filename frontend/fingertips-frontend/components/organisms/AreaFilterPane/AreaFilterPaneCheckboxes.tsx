import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { Area } from '@/generated-sources/ft-api-client';
import React, { FC } from 'react';
import { AreaFilterPaneCheckbox } from '@/components/organisms/AreaFilterPane/AreaFilterPaneCheckbox';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';

const isAreaSelected = (
  areaCode: string,
  selectedAreas?: string[],
  groupAreaSelected?: string
): boolean => {
  if (groupAreaSelected === ALL_AREAS_SELECTED) return true;

  return selectedAreas
    ? selectedAreas?.some((area) => area === areaCode)
    : false;
};

interface AreaFilterPaneCheckboxesProps {
  rows: Area[];
  searchState: SearchStateParams;
  handleAreaSelected: (areaCode: string, checked: boolean) => void;
}

export const AreaFilterPaneCheckboxes: FC<AreaFilterPaneCheckboxesProps> = ({
  rows,
  searchState,
  handleAreaSelected,
}) => {
  const { triggerRef, rowsToShow, hasMore } = useMoreRowsWhenScrolling<Area>(
    rows,
    10
  );

  return (
    <>
      {rowsToShow.map((area) => (
        <AreaFilterPaneCheckbox
          key={area.code}
          code={area.code}
          name={area.name}
          handleAreaSelected={handleAreaSelected}
          isSelected={isAreaSelected(
            area.code,
            searchState?.[SearchParams.AreasSelected],
            searchState?.[SearchParams.GroupAreaSelected]
          )}
        />
      ))}
      <div ref={triggerRef}>{hasMore ? 'Loading...' : null}</div>
    </>
  );
};
