'use client';

import { Button, ErrorText, H3, SearchBox } from 'govuk-react';
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
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';
import { InputField } from '@/components/atoms/InputField';
import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';
import { StyledFormGroup, StyledHintParagraph, StyledSearchBox, StyledTitleParagraph } from '../IndicatorSearchForm';
import styled from 'styled-components';

interface SearchFormProps {
  formState: SearchFormState;
  selectedAreasData?: Area[];
  areaFilterData?: AreaFilterData;
}

const StyledSearchBoxWithBorder = styled(SearchBox)({
  marginBottom: '30px',
  border: `1.5px solid ${GovukColours.Black}`,
})

const StyledInlineSearchBox = styled(SearchBox)({
  // display: 'flex',
  // alignItems: 'stretch',
})

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
      />
      <StyledTitleParagraph>Search by subject</StyledTitleParagraph>
      <StyledHintParagraph>
        For example, smoking, diabetes prevalence, or a specific indicator ID
      </StyledHintParagraph>
      <StyledSearchBoxWithBorder>
        {SearchBox.Input && (
          <SearchBox.Input
            characterLimit={INDICATOR_SEARCH_MAX_CHARACTERS}
            thresholdPercentage={75}
            input={{
              id: 'indicator',
              name: 'indicator',
              defaultValue: formState.indicator ?? '',
            }}
            defaultValue={formState.indicator ?? ''}
            meta={{
              touched: !!formState.message,
              error: 'Enter a subject you want to search for',
            }}
            data-testid="indicator-search-form-input"
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
      {/*<StyledInlineSearchBox>*/}
      {/*<InputField*/}
      {/*  characterLimit={INDICATOR_SEARCH_MAX_CHARACTERS}*/}
      {/*  thresholdPercentage={75}*/}
      {/*  input={{*/}
      {/*    id: 'indicator',*/}
      {/*    name: 'indicator',*/}
      {/*    defaultValue: formState.indicator ?? '',*/}
      {/*  }}*/}
      {/*  hint={*/}
      {/*    <div style={{ color: GovukColours.DarkGrey }}>*/}
      {/*      For example, smoking, diabetes prevalence, or a specific indicator*/}
      {/*      ID*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*  meta={{*/}
      {/*    touched: !!formState.message,*/}
      {/*    error: 'Enter a subject you want to search for',*/}
      {/*  }}*/}
      {/*  data-testid="indicator-search-form-input"*/}
      {/*>*/}
      {/*  Search by subject*/}
      {/*</InputField>*/}
      {/*  {SearchBox.Button && (*/}
      {/*    <SearchBox.Button*/}
      {/*      onClick={() => setIsLoading(true)}*/}
      {/*      type="submit"*/}
      {/*      data-testid="indicator-search-form-submit"*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</StyledInlineSearchBox>*/}
      
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
