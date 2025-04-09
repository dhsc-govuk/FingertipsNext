import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { H5, Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useEffect } from 'react';

interface TimePeriodDropDownProps {
  years: (number | string)[];
  searchState: SearchStateParams;
  selectedYearOverride?: string;
}

const StyledSelect = styled(Select)({
  width: '25em',
  marginBottom: '3em',
});

export function TimePeriodDropDown({
  years,
  searchState,
  selectedYearOverride,
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

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

  useEffect(() => {
    if (selectedYearOverride) setSelectedYear(selectedYearOverride);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid="timePeriod-dropDown-component">
      <H5>Select a time period</H5>
      <StyledSelect
        data-testid="select-timePeriod"
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
