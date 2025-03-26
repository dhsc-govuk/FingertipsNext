import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { H5, Select } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';

interface TimePeriodDropDownProps {
  years: (number | string)[];
  searchState: SearchStateParams;
}

const StyledSelect = styled(Select)({
  width: '25em',
  marginBottom: '3em',
});

export function TimePeriodDropDown({
  years,
  searchState,
}: Readonly<TimePeriodDropDownProps>) {
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchStateManager = SearchStateManager.initialise(searchState);
  const { [SearchParams.YearSelected]: selectedYear } = searchState;

  const setSelectedYear = (selectedYear: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.YearSelected,
      selectedYear
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };
  return (
    <div data-testid="timePeriod-dropDown-component">
      <H5>Select a time period</H5>
      <StyledSelect
        label=""
        input={{
          defaultValue: selectedYear,
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
