import { StyledFilterSelect } from '@/components/styles/StyledFilterSelect';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname } from 'next/navigation';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';
import { ChangeEvent } from 'react';

interface TimePeriodDropDownProps {
  periods: string[];
}

export function TimePeriodDropDown({
  periods,
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();

  const searchState = useSearchStateParams();
  const searchStateManager = SearchStateManager.initialise(searchState);

  const onSelectYear = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
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

    const newUrl = searchStateManager.generatePath(pathname);

    window.history.pushState(null, '', newUrl);
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
          onChange: onSelectYear,
        }}
        style={{ marginBottom: '1.5em' }}
      >
        {periods.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </StyledFilterSelect>
    </div>
  );
}
