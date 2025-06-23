'use client';

import { Button, ErrorText, FormGroup, H3, SearchBox } from 'govuk-react';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { AreaAutoCompleteInputField } from '@/components/molecules/AreaAutoCompleteInputField';
import { SearchParams } from '@/lib/searchStateManager';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { SelectedAreasPanel } from '@/components/molecules/SelectedAreasPanel';
import { Area } from '@/generated-sources/ft-api-client';
import {
  AreaFilterData,
  SelectAreasFilterPanel,
} from '@/components/molecules/SelectAreasFilterPanel';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';
import React, { useEffect } from 'react';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';

import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';
import {
  StyledHintParagraph,
  StyledTitleParagraph,
} from '../IndicatorSearchForm';
import styled from 'styled-components';

interface SearchFormProps {
  formState: SearchFormState;
  selectedAreasData?: Area[];
  areaFilterData?: AreaFilterData;
}

const StyledSearchBoxWithBorder = styled(SearchBox)({
  marginBottom: '30px',
});

export const SearchForm = ({
  formState,
  selectedAreasData,
  areaFilterData,
}: Readonly<SearchFormProps>) => {
  const { setIsLoading } = useLoadingState();
  const { getSearchState } = useSearchState();
  const searchState = getSearchState();

  useEffect(() => {
    if (formState.message) {
      setIsLoading(false);
    }
  });

  const selectedAreas = searchState?.[SearchParams.AreasSelected];

  const inputSuggestionDefaultValue =
    searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED
      ? areaFilterData?.availableGroups?.find(
          (group) => group.code === searchState?.[SearchParams.GroupSelected]
        )?.name
      : selectedAreasData?.[0]?.name;

  return (
    <div data-testid="search-form">
      <H3>Find public health data</H3>
      <input
        name="searchState"
        defaultValue={JSON.stringify(searchState)}
        hidden
        aria-label="Search"
      />
      <FormGroup error={formState.message !== null}>
        <StyledTitleParagraph>Search by subject</StyledTitleParagraph>
        <StyledHintParagraph>
          For example, smoking, diabetes prevalence, or a specific indicator ID
        </StyledHintParagraph>
        {formState.message ? (
          <ErrorText data-testid="indicator-search-form-error">
            Enter a subject you want to search for
          </ErrorText>
        ) : (
          ''
        )}
        <StyledSearchBoxWithBorder>
          {SearchBox.Input && (
            <SearchBox.Input
              characterLimit={INDICATOR_SEARCH_MAX_CHARACTERS}
              thresholdPercentage={75}
              title="indicator"
              id="indicator"
              name="indicator"
              defaultValue={formState.indicator ?? ''}
              data-testid="indicator-search-form-input"
              style={
                !!formState.message
                  ? {
                      borderColor: GovukColours.Red,
                      borderWidth: '4px',
                      borderStyle: 'solid',
                    }
                  : {
                      borderColor: GovukColours.Black,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                    }
              }
            />
          )}
          {SearchBox.Button && (
            <SearchBox.Button
              onClick={() => setIsLoading(true)}
              type="submit"
              data-testid="indicator-search-form-submit"
            />
          )}
        </StyledSearchBoxWithBorder>
      </FormGroup>

      <AreaAutoCompleteInputField
        key={`area-auto-complete-${JSON.stringify(searchState)}`}
        inputFieldErrorStatus={!!formState.message}
        selectedAreaName={inputSuggestionDefaultValue}
      />

      {(selectedAreas && selectedAreas.length > 0) ||
      searchState?.[SearchParams.GroupAreaSelected] === ALL_AREAS_SELECTED ? (
        <SelectedAreasPanel
          key={`selected-area-panel-${JSON.stringify(searchState)}`}
          areaFilterData={areaFilterData}
          selectedAreasData={selectedAreasData}
          isFullWidth={false}
        />
      ) : null}

      <Button
        type="submit"
        data-testid="search-form-button-submit"
        style={{ marginTop: 10 }}
        onClick={() => setIsLoading(true)}
      >
        Search
      </Button>

      <ArrowExpander
        openTitle="Open area filter"
        closeTitle="Close area filter"
      >
        <SelectAreasFilterPanel
          key={`area-filter-panel-${JSON.stringify(searchState)}`}
          areaFilterData={areaFilterData}
        />
      </ArrowExpander>
    </div>
  );
};
