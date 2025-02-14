'use client';

import { BackLink, ErrorSummary, GridCol, GridRow, H1 } from 'govuk-react';
import { useActionState } from 'react';
import {
  SearchResultState,
  submitIndicatorSelection,
} from './searchResultsActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { AreaFilter } from '@/components/organisms/AreaFilter';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import {
  AreaWithRelations,
  AreaType,
  Area,
} from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';
import { IndicatorSelectionForm } from '@/components/forms/IndicatorSelectionForm';

type SearchResultsProps = {
  searchResultsState: SearchResultState;
  searchResults: IndicatorDocument[];
  availableAreaTypes?: AreaType[];
  availableGroupTypes?: AreaType[];
  availableAreas?: Area[];
  selectedAreasData?: AreaWithRelations[];
  searchState?: SearchStateParams;
};

const generateBackLinkPath = (state?: SearchStateParams) => {
  const stateManager = new SearchStateManager({
    [SearchParams.SearchedIndicator]: state?.[SearchParams.SearchedIndicator],
  });
  return stateManager.generatePath('/');
};

export function SearchResults({
  searchResultsState,
  searchResults,
  availableAreaTypes,
  availableGroupTypes,
  availableAreas,
  selectedAreasData,
  searchState,
}: Readonly<SearchResultsProps>) {
  const initialSearchResultsFormState: SearchResultState = {
    ...searchResultsState,
    searchState: JSON.stringify(searchState),
  };

  const [indicatorSelectionState, indicatorSelectionFormAction] =
    useActionState(submitIndicatorSelection, initialSearchResultsFormState);

  const backLinkPath = generateBackLinkPath(searchState);

  const initialIndicatorSearchFormState: IndicatorSearchFormState = {
    indicator: searchState?.[SearchParams.SearchedIndicator] ?? '',
    searchState: JSON.stringify(searchState),
  };
  const [indicatorSearchState, indicatorSearchFormAction] = useActionState(
    searchIndicator,
    initialIndicatorSearchFormState
  );

  return (
    <>
      <BackLink href={backLinkPath} data-testid="search-results-back-link" />
      <>
        {indicatorSelectionState.message && (
          <ErrorSummary
            description={indicatorSelectionState.message}
            errors={[
              {
                targetName: `search-results-indicator-${searchResults[0].indicatorId.toString()}`,
                text: 'Available indicators',
              },
            ]}
            data-testid="search-result-form-error-summary"
            onHandleErrorClick={(targetName: string) => {
              const indicator = document.getElementById(targetName);
              indicator?.scrollIntoView(true);
              indicator?.focus();
            }}
          />
        )}
        <H1>
          Search results for {searchState?.[SearchParams.SearchedIndicator]}
        </H1>
        <form action={indicatorSearchFormAction}>
          <IndicatorSearchForm
            key={JSON.stringify(searchState)}
            indicatorSearchFormState={indicatorSearchState}
            searchState={searchState}
          />
        </form>
        <GridRow>
          <GridCol setWidth="one-third">
            <AreaFilter
              availableAreaTypes={availableAreaTypes}
              availableGroupTypes={availableGroupTypes}
              availableAreas={availableAreas}
              selectedAreasData={selectedAreasData}
              searchState={searchState}
            />
          </GridCol>
          <GridCol>
            <IndicatorSelectionForm
              searchResultsFormState={indicatorSelectionState}
              searchResults={searchResults}
              searchState={searchState}
              formAction={indicatorSelectionFormAction}
            />
          </GridCol>
        </GridRow>
      </>
    </>
  );
}
