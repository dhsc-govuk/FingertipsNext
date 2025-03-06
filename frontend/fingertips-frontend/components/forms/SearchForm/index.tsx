'use client';

import { getAreaDocument } from './searchActions';
import { Button, InputField, H3 } from 'govuk-react';
import { usePathname, useRouter } from 'next/navigation';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import AreaAutoCompleteInputField from '@/components/molecules/AreaAutoCompleteSearchPanel';
import { AreaDocument } from '@/lib/search/searchTypes';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useEffect, useState } from 'react';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

interface SearchFormProps {
  searchState?: SearchStateParams;
  formState: SearchFormState;
}

export const SearchForm = ({
  searchState,
  formState,
}: Readonly<SearchFormProps>) => {
  const stateManager = SearchStateManager.initialise(searchState);
  const pathname = usePathname();
  const router = useRouter();
  const [areaCode, setAreaCode] = useState<string>(
    formState.areaSearched ?? ''
  );
  const [defaultAreas, setDefaultAreas] = useState<AreaDocument[]>([]);

  const updateUrlWithSelectedArea = (selectedAreaCode: string | undefined) => {
    if (!selectedAreaCode) {
      stateManager.removeAllParamFromState(SearchParams.AreasSelected);
    } else {
      stateManager.addParamValueToState(
        SearchParams.AreasSelected,
        selectedAreaCode
      );
    }
    router.replace(stateManager.generatePath(pathname), { scroll: false });
  };

  useEffect(() => {
    const fetchAreaDocumentAndUpdate = async (areaCode: string | undefined) => {
      if (areaCode == undefined) return null;
      const area = await getAreaDocument(areaCode);
      if (area) {
        setDefaultAreas([area]);
      }
    };
    fetchAreaDocumentAndUpdate(areaCode);
  }, [searchState, areaCode, formState]);

  return (
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <StyledInputField
        input={{
          id: 'indicator',
          name: 'indicator',
          defaultValue: formState.indicator ?? '',
        }}
        hint={
          <div style={{ color: GovukColours.DarkGrey }}>
            For example, smoking, diabetes prevalence, or a specific indicator
            ID
          </div>
        }
        meta={{
          touched: !!formState.message,
          error: 'Enter a subject you want to search for',
        }}
        data-testid="indicator-search-form-input"
      >
        Search by subject
      </StyledInputField>
      <input
        type="hidden"
        name="areaSearched"
        id="areaSearched"
        value={areaCode || ''}
      />
      <AreaAutoCompleteInputField
        onAreaSelected={(area: AreaDocument | undefined) => {
          updateUrlWithSelectedArea(area?.areaCode ?? '');
          setAreaCode(area?.areaCode ?? '');
        }}
        inputFieldErrorStatus={!!formState.message}
        defaultSelectedAreas={defaultAreas}
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
