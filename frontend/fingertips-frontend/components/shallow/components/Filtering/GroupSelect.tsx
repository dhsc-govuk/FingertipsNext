import { ChangeEvent, FC } from 'react';
import { useApiAreaTypeMembersGet } from '@/components/shallow/hooks/useApiAreaTypeMembersGet';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { Select } from 'govuk-react';

export const GroupSelect: FC = () => {
  const { groupTypeSelected, shallowUpdate, search, groupSelected } =
    useShallowSearchParams();
  const { areas: groups } = useApiAreaTypeMembersGet(groupTypeSelected);

  const onSelectGroup = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSearchParams = new URLSearchParams(search.toString());
    newSearchParams.set('gs', e.target.value);
    newSearchParams.delete('as');
    shallowUpdate(newSearchParams);
  };

  // default to england
  const options = groups.length
    ? groups
    : [{ code: 'england', name: 'England' }];

  return (
    <Select
      label={'Select a group type'}
      input={{
        onChange: onSelectGroup,
        value: groupSelected,
        name: 'gs',
        disabled: options.length <= 1,
      }}
    >
      {options.map((group) => (
        <option key={group.code} value={group.code}>
          {group.name}
        </option>
      ))}
    </Select>
  );
};
