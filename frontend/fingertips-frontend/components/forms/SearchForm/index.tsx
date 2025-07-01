'use client';

import { Button, ErrorText, FormGroup, H3, Link, SearchBox } from 'govuk-react';
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
import React, { useEffect } from 'react';
import { ArrowExpander } from '@/components/molecules/ArrowExpander';

import { INDICATOR_SEARCH_MAX_CHARACTERS } from '@/lib/search/indicatorSearchService';
import { useSearchStateParams } from '@/components/hooks/useSearchStateParams';

import styled from 'styled-components';
import {
  StyledHintParagraph,
  StyledTitleParagraph,
} from '@/lib/formHelpers/formStyling';

interface SearchFormProps {
  formState: SearchFormState;
  selectedAreasData?: Area[];
  areaFilterData?: AreaFilterData;
}

const StyledSearchBoxWithBorder = styled(SearchBox)({
  marginBottom: '30px',
});

const SpacedTitle = styled(H3)({
  marginTop: '40px',
});

const StyledClearAllLink = styled(Link)({
  marginLeft: '20px',
})

export const SearchForm = ({
  formState,
  selectedAreasData,
  areaFilterData,
}: Readonly<SearchFormProps>) => {
  const { setIsLoading } = useLoadingState();
  const searchState = useSearchStateParams();
  console.log('formState', formState);

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

  const inputStyle = formState.message
    ? {
        borderColor: GovukColours.Red,
        borderWidth: '4px',
        borderStyle: 'solid',
      }
    : {
        borderColor: GovukColours.Black,
        borderWidth: '2px',
        borderStyle: 'solid',
      };
  
  const handleClearAll = (e: React.MouseEvent<HTMLAnchorElement>) => {}

  return (
    <div data-testid="search-form">
      <SpacedTitle>Find public health data</SpacedTitle>
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
        ) : null}
        <StyledSearchBoxWithBorder>
          {SearchBox.Input ? (
            <SearchBox.Input
              characterLimit={INDICATOR_SEARCH_MAX_CHARACTERS}
              thresholdPercentage={75}
              title="indicator"
              id="indicator"
              name="indicator"
              defaultValue={formState.indicator ?? ''}
              data-testid="indicator-search-form-input"
              style={inputStyle}
              onKeyDown={(e: { key: string }) => {
                if (e.key === 'Enter' || e.key === 'Return') {
                  setIsLoading(true);
                }
              }}
            />
          ) : null}
          {SearchBox.Button ? (
            <SearchBox.Button
              onClick={() => setIsLoading(true)}
              type="submit"
              data-testid="indicator-search-form-submit"
            />
          ) : null}
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
      <div>
        <Button
          type="submit"
          data-testid="search-form-button-submit"
          style={{ marginTop: 10 }}
          onClick={() => setIsLoading(true)}
        >
          Search
        </Button>
        <StyledClearAllLink href="/" onClick={handleClearAll}>Clear all</StyledClearAllLink>
      </div>

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
