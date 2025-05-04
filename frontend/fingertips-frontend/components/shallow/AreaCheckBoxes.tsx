import { Checkbox } from 'govuk-react';
import { useApiAreaTypeMembersGet } from '@/components/shallow/useApiAreaTypeMembersGet';
import { determineSelectedGroup } from '@/lib/areaFilterHelpers/determineSelectedGroup';
import { useApiAreasGet } from '@/components/shallow/useApiAreasGet';
import { useShallowSearchParams } from '@/components/shallow/useShallowSearchParams';
import { Area } from '@/generated-sources/ft-api-client';
import { SyntheticEvent } from 'react';

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

  const onSelectArea = (area: Area) => (e: SyntheticEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(search.toString());

    if (newSearchParams.has('as', area.code)) {
      newSearchParams.delete('as', area.code);
    } else {
      newSearchParams.append('as', area.code);
    }

    shallowUpdate(newSearchParams);
  };

  console.log({ groups, determinedSelectedGroup, selectedAreaType, areas });

  return (
    <div>
      {areas.map((area) => (
        <Checkbox
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
