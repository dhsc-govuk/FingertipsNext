'use client';

<<<<<<< HEAD
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
=======
import { SearchFormState, getSearchSuggestions } from './searchActions';
import { Button, InputField, H3, Link } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
>>>>>>> main

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
<<<<<<< HEAD
      />
=======
        hint={
          <div style={{ color: GovukColours.DarkGrey }}>
            For example, district, county, region, NHS organisation or GP
            practice or code
          </div>
        }
        meta={{
          touched: !!searchFormState.message,
          error: 'This field value may be required',
        }}
        data-testid="search-form-input-area"
      >
        Search by area
      </StyledInputField>
      <Link href="#" data-testid="search-form-link-filter-area">
        Or filter by area
      </Link>
      <br />
>>>>>>> main
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
