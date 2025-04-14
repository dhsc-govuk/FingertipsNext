import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import {
  SearchParamKeys,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';

interface InequalitiesTypeDropDownProps {
  inequalitiesOptions: string[];
  inequalityTypeSelectedSearchParam: SearchParamKeys;
  testRef: string;
  searchState: SearchStateParams;
}

export function InequalitiesTypesDropDown({
  inequalitiesOptions,
  inequalityTypeSelectedSearchParam,
  testRef,
  searchState,
}: Readonly<InequalitiesTypeDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

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
    <div data-testid={`inequalitiesTypes-dropDown-component-${testRef}`}>
      <StyledFilterSelect
        label="Select an inequality type"
        data-testid={`select-inequality-type-${testRef}`}
        aria-label="Select an inequality type"
        input={{
          value: selectedType,
          onChange: (e) => {
            setSelectedType(e.target.value);
          },
        }}
        style={{ marginBottom: '1.5em' }}
      >
        {inequalitiesOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </StyledFilterSelect>
    </div>
  );
}
