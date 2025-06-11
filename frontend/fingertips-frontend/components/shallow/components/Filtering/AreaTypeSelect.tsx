import { ChangeEvent, FC } from 'react';
import { useShallowSearchParams } from '@/components/shallow/hooks/useShallowSearchParams';
import { useApiAreaTypesGet } from '@/components/shallow/hooks/useApiAreaTypesGet';
import { Select } from 'govuk-react';

export const AreaTypeSelect: FC = () => {
  const { search, shallowUpdate, areaTypeSelected } = useShallowSearchParams();
  const { areaTypes } = useApiAreaTypesGet();

  const onSelectAreaType = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSearchParams = new URLSearchParams(search.toString());
    newSearchParams.set('ats', e.target.value);
    newSearchParams.delete('gts');
    newSearchParams.delete('gs');
    newSearchParams.delete('as');
    shallowUpdate(newSearchParams);
  };

  return (
    <Select
      label={'Select an area type'}
      input={{
        onChange: onSelectAreaType,
        value: areaTypeSelected,
        name: 'ats',
      }}
    >
      {areaTypes.map((areaType) => (
        <option key={areaType.key} value={areaType.key}>
          {areaType.name}
        </option>
      ))}
    </Select>
  );
};
