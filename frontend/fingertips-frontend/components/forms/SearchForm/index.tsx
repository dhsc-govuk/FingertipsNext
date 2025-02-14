'use client';

import { SearchFormState } from './searchActions';
import {
  InsetText,
  Button,
  InputField,
  Paragraph,
  H3,
  Link,
} from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import AreaAutoCompleteSearchPanel from '@/components/molecules/AreaAutoCompleteSearchPanel';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const SearchForm = ({
  searchFormState,
}: {
  searchFormState: SearchFormState;
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const existingParams = new URLSearchParams(searchParams);
  const searchStateManager =
    SearchStateManager.setStateFromParams(existingParams);

  const updateUrlWithSelectedArea = (areaCodeSelected: string) => {
    searchStateManager.addParamValueToState(
      SearchParams.AreasSelected,
      areaCodeSelected
    );
    replace(searchStateManager.generatePath(pathname), { scroll: false });
  };

  console.log('SEARCH = ', searchFormState.message);
  return (
    <div
      data-testid="search-form"
      style={{ backgroundColor: '#f3f2f1', padding: '20px 20px 0px 20px' }}
    >
      <H3>Find public health data</H3>
      <Paragraph>
        Search for data to compare at local, regional and national levels.
      </Paragraph>
      <InsetText>
        Use both search options to help you find the most accurate data
        available.
      </InsetText>
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: searchFormState.indicator,
        }}
        hint={
          <div style={{ color: '#505a5f' }}>
            For example diabetes, public health indicator, or indicator ID
          </div>
        }
        // meta={{
        //   touched: !!searchFormState.message,
        //   error: 'This field value may be required',
        // }}
        // data-testid="indicator-search-form-input"
      >
        Search by subject
      </StyledInputField>

      <AreaAutoCompleteSearchPanel
        onAreaSelected={(area) => {
          updateUrlWithSelectedArea(area.areaCode);
          searchFormState.areaSearched = area.areaCode;
        }}
      />
      <Button
        type="submit"
        data-testid="search-form-button-submit"
        style={{ marginTop: '25px' }}
      >
        Search
      </Button>
    </div>
  );
};
