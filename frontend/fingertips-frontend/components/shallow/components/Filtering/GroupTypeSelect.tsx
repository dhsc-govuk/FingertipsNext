import { ChangeEvent, FC } from 'react';
import { determineApplicableGroupTypes } from '@/lib/areaFilterHelpers/determineApplicableGroupTypes';
import { AreaTypeKeys } from '@/lib/areaFilterHelpers/areaType';
import { useApiAreaTypesGet } from '@/components/shallow/hooks/useApiAreaTypesGet';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { Select } from 'govuk-react';

export const GroupTypeSelect: FC = () => {
  const { areaTypeSelected, groupTypeSelected, shallowUpdate, search } =
    useShallowSearchParams();

  // get all the areaTypes
  const { areaTypes } = useApiAreaTypesGet();

  // and filter by selectedAreaType
  const availableGroupTypes = determineApplicableGroupTypes(
    areaTypes,
    areaTypeSelected as AreaTypeKeys
  );

  // and then sort
  const sortedByLevelGroupTypes =
    availableGroupTypes?.toSorted((a, b) => a.level - b.level) ?? [];

  const onSelectGroupType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSearchParams = new URLSearchParams(search.toString());
    newSearchParams.set('gts', e.target.value);
    newSearchParams.delete('gs');
    newSearchParams.delete('as');
    shallowUpdate(newSearchParams);
  };

  return (
    <Select
      label={'Select a group type'}
      input={{
        onChange: onSelectGroupType,
        value: groupTypeSelected,
        name: 'gts',
        disabled: sortedByLevelGroupTypes.length <= 1,
      }}
    >
      {sortedByLevelGroupTypes.map((areaType) => (
        <option key={areaType.key} value={areaType.key}>
          {areaType.name}
        </option>
      ))}
    </Select>
  );
};
