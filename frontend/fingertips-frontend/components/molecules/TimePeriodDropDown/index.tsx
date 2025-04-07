import { useSearchState } from '@/context/SearchStateContext';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { H5, Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

interface TimePeriodDropDownProps {
  years: (number | string)[];
}

const StyledSelect = styled(Select)({
  width: '25em',
  marginBottom: '3em',
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
      <H5>Select a time period</H5>
      <StyledSelect
        aria-label="select-timePeriod"
        label=""
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
      </StyledSelect>
    </div>
  );
}
