import { useSearchState } from '@/context/SearchStateContext';
import { SearchParamKeys, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import { StyledFilterSelect } from '../../SelectAreasFilterPanel';

interface InequalitiesTypeDropDownProps {
  inequalitiesOptions: string[];
  inequalityTypeSelectedSearchParam: SearchParamKeys;
}

export function InequalitiesTypesDropDown({
  inequalitiesOptions,
  inequalityTypeSelectedSearchParam,
}: Readonly<InequalitiesTypeDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedType = (selectedType: string) => {
    searchStateManager.addParamValueToState(
      inequalityTypeSelectedSearchParam,
      selectedType
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const { [inequalityTypeSelectedSearchParam]: selectedType } =
    searchStateManager.getSearchState();

  return (
    <StyledFilterSelect
      label="Select an inequality type"
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
    </StyledFilterSelect>
  );
}
