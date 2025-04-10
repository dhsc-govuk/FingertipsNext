import { useLoadingState } from '@/context/LoaderContext';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

interface TimePeriodDropDownProps {
  years: (number | string)[];
  searchState: SearchStateParams;
}

const StyledFilterSelect = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
  marginBottom: '2em',
});

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
      >
        {years.map((key) => (
          <option key={key}>{key}</option>
        ))}
      </StyledFilterSelect>
    </div>
  );
}
