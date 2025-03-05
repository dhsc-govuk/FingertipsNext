'use client';

import { BackLink, ErrorSummary, GridCol, GridRow, H1 } from 'govuk-react';
import { useActionState } from 'react';
import {
  IndicatorSelectionState,
  submitIndicatorSelection,
} from '../../forms/IndicatorSelectionForm/indicatorSelectionActions';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { AreaFilterPane } from '@/components/organisms/AreaFilterPane';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';
import { IndicatorSelectionForm } from '@/components/forms/IndicatorSelectionForm';
import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';

type SearchResultsProps = {
  initialIndicatorSelectionState: IndicatorSelectionState;
  searchResults: IndicatorDocument[];
  areaFilterData?: AreaFilterData;
  selectedAreasData?: AreaWithRelations[];
  searchState?: SearchStateParams;
  currentDate?: Date;
};

const generateBackLinkPath = (state?: SearchStateParams) => {
  const stateManager = SearchStateManager.initialise(state);
  return stateManager.generatePath('/');
};

export function SearchResults({
  initialIndicatorSelectionState,
  searchResults,
  areaFilterData,
  selectedAreasData,
  searchState,
  currentDate,
}: Readonly<SearchResultsProps>) {
  const [indicatorSelectionState, indicatorSelectionFormAction] =
    useActionState(submitIndicatorSelection, initialIndicatorSelectionState);

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
            // description={indicatorSelectionState.message}
            errors={[
              {
                targetName: `search-results-indicator-${searchResults[0].indicatorID.toString()}`,
                text: 'Select any indicators you want to view',
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
            <AreaFilterPane
              key={JSON.stringify(searchState)}
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
              searchState={searchState}
            />
          </GridCol>
          <GridCol>
            <IndicatorSelectionForm
              key={JSON.stringify(searchState)}
              searchResults={searchResults}
              searchState={searchState}
              formAction={indicatorSelectionFormAction}
              currentDate={currentDate}
            />
          </GridCol>
        </GridRow>
      </>
    </>
  );
}
