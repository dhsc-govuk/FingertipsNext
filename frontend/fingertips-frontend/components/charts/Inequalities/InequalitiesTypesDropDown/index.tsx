import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { SearchParamKeys, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname } from 'next/navigation';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface InequalitiesTypeDropDownProps {
  inequalitiesOptions: string[];
  inequalityTypeSelectedSearchParam: SearchParamKeys;
  testRef: string;
}

export function InequalitiesTypesDropDown({
  inequalitiesOptions,
  inequalityTypeSelectedSearchParam,
  testRef,
}: Readonly<InequalitiesTypeDropDownProps>) {
  const pathname = usePathname();

  const searchState = useSearchStateParams();
  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedType = (selectedType: string) => {
    searchStateManager.addParamValueToState(
      inequalityTypeSelectedSearchParam,
      selectedType
    );
    const newUrl = searchStateManager.generatePath(pathname);

    window.history.pushState(null, '', newUrl);
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
