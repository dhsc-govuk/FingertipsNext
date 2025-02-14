'use client';

import { SearchFormState } from './searchActions';
import { Button, InputField, H3, Link } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { AreaDocument } from '@/lib/search/searchTypes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import AreaAutoCompleteSearchPanel from '@/components/molecules/AreaAutoCompleteSearchPanel';

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

  return (
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: searchFormState.indicator,
        }}
        hint={
          <div style={{ color: GovukColours.DarkGrey }}>
            For example, smoking, diabetes prevalence, or a specific indicator
            ID
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="indicator-search-form-input"
      >
        Search by subject
      </StyledInputField>
      <AreaAutoCompleteSearchPanel
        onAreaSelected={(area: AreaDocument) => {
          updateUrlWithSelectedArea(area.areaCode);
          searchFormState.areaSearched = area.areaCode;
        }}
        inputFieldErrorStatus={!!searchFormState.message}
        defaultValue={searchFormState.areaSearched}
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
