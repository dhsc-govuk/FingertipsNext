import { useSearchState } from '@/context/SearchStateContext';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

interface TimePeriodDropDownProps {
  years: (number | string)[];
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
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  const searchStateManager = SearchStateManager.initialise(searchState);

  const setSelectedYear = (selectedYear: string) => {
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
