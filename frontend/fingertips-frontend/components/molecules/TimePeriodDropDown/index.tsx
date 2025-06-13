import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { useLoadingState } from '@/context/LoaderContext';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

interface TimePeriodDropDownProps {
  years: (number | string)[];
}

export function TimePeriodDropDown({
  years,
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setIsLoading } = useLoadingState();

  const searchState = useSearchStateParams();
  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedYear = (selectedYear: string) => {
    setIsLoading(true);

    searchStateManager.removeParamValueFromState(
      SearchParams.InequalityBarChartTypeSelected
    );
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
