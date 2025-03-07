'use client';

import { Button, InputField, H3 } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { AreaAutoCompleteInputField } from '@/components/molecules/AreaAutoCompleteInputField';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { AreaAutoCompleteFilterPanel } from '@/components/molecules/AreaFilterPanel';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';

const StyledInputField = styled(InputField)(
  spacing.withWhiteSpace({ marginBottom: 6 })
);

interface SearchFormProps {
  searchState?: SearchStateParams;
  formState: SearchFormState;
  selectedAreasData?: AreaWithRelations[];
  areaFilterData?: AreaFilterData;
}

export const SearchForm = ({
  searchState,
  formState,
  selectedAreasData,
  areaFilterData,
}: Readonly<SearchFormProps>) => {
  console.log(`areaFilterData ${JSON.stringify(areaFilterData)}`);

  const selectedAreas = searchState?.[SearchParams.AreasSelected];

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
        value={selectedAreas || ''}
      />
      <AreaAutoCompleteInputField
        inputFieldErrorStatus={!!formState.message}
        searchState={searchState}
        firstSelectedArea={selectedAreasData?.[0]}
      />

      {selectedAreas && selectedAreas.length > 0 ? (
        <SelectedAreasPanel
          searchState={searchState}
          selectedAreasData={selectedAreasData}
          inFilterPane={false}
        />
      ) : null}

      <AreaAutoCompleteFilterPanel areas={selectedAreas} />

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
