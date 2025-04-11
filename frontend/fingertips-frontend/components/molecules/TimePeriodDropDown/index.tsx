import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { useLoadingState } from '@/context/LoaderContext';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';

interface TimePeriodDropDownProps {
  years: (number | string)[];
  searchState: SearchStateParams;
}

export function TimePeriodDropDown({
  years,
  searchState,
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedYear = (selectedYear: string) => {
    setIsLoading(true);

    searchStateManager.removeParamValueFromState(
      SearchParams.InequalityBarChartAreaSelected
    );
    searchStateManager.addParamValueToState(
      SearchParams.InequalityYearSelected,
      selectedYear
    );

    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  const { [SearchParams.InequalityYearSelected]: selectedYear } =
    searchStateManager.getSearchState();

  return (
    <div data-testid="timePeriod-dropDown-component">
      <StyledFilterSelect
        data-testid="select-timePeriod"
        aria-label="Select a time period"
        label="Select a time period"
        input={{
          value: selectedYear,
          onChange: (e) => {
            setSelectedYear(e.target.value);
          },
        }}
        style={{ marginBottom: '1.5em' }}
      >
        {years.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </StyledFilterSelect>
    </div>
  );
}
