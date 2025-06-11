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
    areasSelected,
    areaTypeSelected,
    groupTypeSelected,
    groupSelected,
  } = useShallowSearchParams();
  const { areas: groups } = useApiAreaTypeMembersGet(groupTypeSelected);
  const determinedSelectedGroup = determineSelectedGroup(groupSelected, groups);
  const { areas } = useApiAreasGet(determinedSelectedGroup, areaTypeSelected);

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
          sizeVariant="SMALL"
          value={area.code}
          checked={areasSelected.includes(area.code)}
          onChange={onSelectArea(area)}
          name={'as'}
        >
          {area.name}
        </Checkbox>
      ))}
    </div>
  );
};
