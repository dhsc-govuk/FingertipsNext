import { Checkbox } from 'govuk-react';
import { useApiAreaTypeMembersGet } from '@/components/shallow/hooks/useApiAreaTypeMembersGet';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';
import { useApiAreasGet } from '@/components/shallow/hooks/useApiAreasGet';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { Area } from '@/generated-sources/ft-api-client';
import { ChangeEvent } from 'react';

export const AreaCheckBoxes = () => {
  const {
    search,
    shallowUpdate,
    selectedAreas,
    selectedAreaType,
    selectedGroupType,
    selectedGroup,
  } = useShallowSearchParams();
  const { areas: groups } = useApiAreaTypeMembersGet(selectedGroupType);
  const determinedSelectedGroup = determineSelectedGroup(selectedGroup, groups);
  const { areas } = useApiAreasGet(determinedSelectedGroup, selectedAreaType);

  const onSelectArea = (area: Area) => (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchParams = new URLSearchParams(search);
    if (!e.target.checked) {
      newSearchParams.delete('as', area.code);
    } else {
      newSearchParams.append('as', area.code);
    }

    shallowUpdate(newSearchParams);
  };

  return (
    <div>
      {areas.map((area) => (
        <Checkbox
          id={area.code}
          key={area.code}
          value={area.code}
          checked={selectedAreas.includes(area.code)}
          onChange={onSelectArea(area)}
          name={'as'}
        >
          {area.name}
        </Checkbox>
      ))}
    </div>
  );
};
