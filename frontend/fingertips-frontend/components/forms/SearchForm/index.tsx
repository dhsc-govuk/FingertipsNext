'use client';

import { Button, InputField, H3 } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { AreaAutoCompleteInputField } from '@/components/molecules/AreaAutoCompleteInputField';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import {
  AreaFilterData,
  SelectAreasFilterPanel,
} from '@/components/molecules/SelectAreasFilterPanel';
import { ShowHideContainer } from '@/components/molecules/ShowHideContainer';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

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
  const selectedAreas = searchState?.[SearchParams.AreasSelected];

  return (
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <input
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
      />
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
      <AreaAutoCompleteInputField
        key={`area-auto-complete-${JSON.stringify(searchState)}`}
        inputFieldErrorStatus={!!formState.message}
        searchState={searchState}
        firstSelectedArea={selectedAreasData?.[0]}
      />

      {(selectedAreas && selectedAreas.length > 0) ||
      searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED ? (
        <SelectedAreasPanel
          key={`selected-area-panel-${JSON.stringify(searchState)}`}
          searchState={searchState}
          areaFilterData={areaFilterData}
          selectedAreasData={selectedAreasData}
          inFilterPane={false}
        />
      ) : null}

      <ShowHideContainer summary="Filter by area" open={false}>
        <SelectAreasFilterPanel
          key={`area-filter-panel-${JSON.stringify(searchState)}`}
          areaFilterData={areaFilterData}
          searchState={searchState}
        />
      </ShowHideContainer>

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
