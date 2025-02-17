'use client';

import { SearchFormState, getArea } from './searchActions';
import { Button, InputField, H3 } from 'govuk-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import AreaAutoCompleteSearchPanel from '@/components/molecules/AreaAutoCompleteSearchPanel';
import { AreaDocument } from '@/lib/search/searchTypes';
import { SearchParams } from '@/lib/searchStateManager';
import { useCallback, useEffect, useState } from 'react';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

export const SearchForm = ({
  searchFormState,
}: {
  searchFormState: SearchFormState;
}) => {
  console.log('Search state = ', searchFormState);
  const params = useSearchParams();
  const router = useRouter();
  const [selectedAreaCode, setSelectedAreaCode] = useState<
    string | undefined
  >();
  const [defaultAreas, setDefaultAreas] = useState<AreaDocument[]>([]);

  const updateUrlWithSelectedArea = (selectedAreaCode: string | undefined) => {
    const urlParams = new URLSearchParams(params);
    if (selectedAreaCode == undefined) {
      urlParams.delete(SearchParams.AreasSelected);
    } else {
      urlParams.set(SearchParams.AreasSelected, selectedAreaCode);
    }
    router.push(`?${urlParams.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const selectedArea =
      params.get(SearchParams.AreasSelected) ?? searchFormState.areaSearched;
    const fetchAreaDocumentAndUpdate = async (areaCode: string | undefined) => {
      if (areaCode == undefined) return null;
      const area = await getArea(areaCode);
      if (area !== null && area !== undefined) {
        setDefaultAreas([area]);
      }
      setSelectedAreaCode(area?.areaCode);
    };
    fetchAreaDocumentAndUpdate(selectedArea ?? undefined);
  }, [params, searchFormState.areaSearched]);

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
        onAreaSelected={(area: AreaDocument | undefined) => {
          setSelectedAreaCode(area?.areaCode);
          updateUrlWithSelectedArea(area?.areaCode);
        }}
        inputFieldErrorStatus={!!searchFormState.message}
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
