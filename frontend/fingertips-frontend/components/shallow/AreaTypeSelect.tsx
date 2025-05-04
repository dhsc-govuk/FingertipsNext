import { ChangeEvent, FC } from 'react';
import { useShallowSearchParams } from '@/components/shallow/useShallowSearchParams';
import { useApiAreaTypesGet } from '@/components/shallow/useApiAreaTypesGet';
import { Select } from 'govuk-react';

export const AreaTypeSelect: FC = () => {
  const { search, shallowUpdate, selectedAreaType } = useShallowSearchParams();
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
        value: selectedAreaType,
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
