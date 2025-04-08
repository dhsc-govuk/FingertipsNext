import { useSearchState } from '@/context/SearchStateContext';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H5, Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

interface InequalitiesTypeDropDownProps {
  inequalitiesOptions: string[];
}

const StyledSelect = styled(Select)({
  width: '75em',
  marginBottom: '3em',
});

export function InequalitiesTypesDropDown({
  inequalitiesOptions,
}: Readonly<InequalitiesTypeDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedType = (selectedType: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.InequalityTypeSelected,
      selectedType
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const { [SearchParams.InequalityTypeSelected]: selectedType } =
    searchStateManager.getSearchState();

  return (
    <div data-testid="inequalitiesTypes-dropDown-component">
      <H5 style={{ marginBottom: '5px' }}>Select an inequality type</H5>
      <StyledSelect
        label=""
        data-testid="select-inequality-type"
        aria-label="select-inequality-type"
        input={{
          value: selectedType,
          onChange: (e) => {
            setSelectedType(e.target.value);
          },
        }}
      >
        {inequalitiesOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </StyledSelect>
    </div>
  );
}
