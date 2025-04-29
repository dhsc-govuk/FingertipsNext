'use client';

import { BackLink, ErrorSummary, GridCol, GridRow, H1 } from 'govuk-react';
import { useActionState, useEffect, useState } from 'react';
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
import { Area } from '@/generated-sources/ft-api-client';
import { IndicatorSearchForm } from '@/components/forms/IndicatorSearchForm';
import {
  IndicatorSearchFormState,
  searchIndicator,
} from '@/components/forms/IndicatorSearchForm/indicatorSearchActions';
import { IndicatorSelectionForm } from '@/components/forms/IndicatorSelectionForm';
import { AreaFilterData } from '@/components/molecules/SelectAreasFilterPanel';
import { useLoadingState } from '@/context/LoaderContext';
import { useSearchState } from '@/context/SearchStateContext';

type SearchResultsProps = {
  initialIndicatorSelectionState: IndicatorSelectionState;
  searchResults: IndicatorDocument[];
  areaFilterData?: AreaFilterData;
  isEnglandSelectedAsGroup: boolean;
  selectedAreasData?: Area[];
  searchState?: SearchStateParams;
  currentDate?: Date;
};

export const RESULTS_PER_PAGE = 15;

const generateBackLinkPath = (state?: SearchStateParams) => {
  const stateManager = SearchStateManager.initialise(state);
  return stateManager.generatePath('/');
};

export function SearchResults({
  initialIndicatorSelectionState,
  searchResults,
  areaFilterData,
  selectedAreasData,
  isEnglandSelectedAsGroup,
  searchState,
  currentDate,
}: Readonly<SearchResultsProps>) {
  const { setIsLoading } = useLoadingState();
  const { setSearchState } = useSearchState();

  useEffect(() => {
    setSearchState(searchState ?? {});
  }, [searchState, setSearchState]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const searchTerm = searchState?.[SearchParams.SearchedIndicator] ?? '';

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(searchResults.length / RESULTS_PER_PAGE);

  const searchTitle =
    'Search results' +
    (searchTerm ? ' for ' + searchTerm : '') +
    (totalPages > 1 ? ' (page ' + currentPage + ' of ' + totalPages + ')' : '');

  return (
    <>
      <BackLink
        onClick={() => setIsLoading(true)}
        href={backLinkPath}
        data-testid="search-results-back-link"
      />
      <>
        {indicatorSelectionState.message && (
          <ErrorSummary
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
        <H1>{searchTitle}</H1>
        <form action={indicatorSearchFormAction}>
          <IndicatorSearchForm
            indicatorSearchFormState={indicatorSearchState}
          />
        </form>
        <GridRow>
          <GridCol setWidth="one-third">
            <AreaFilterPane
              areaFilterData={areaFilterData}
              selectedAreasData={selectedAreasData}
            />
          </GridCol>
          <GridCol>
            <IndicatorSelectionForm
              searchResults={searchResults}
              showTrends={
                selectedAreasData?.length === 1 ||
                (selectedAreasData?.length === 0 && isEnglandSelectedAsGroup)
              }
              formAction={indicatorSelectionFormAction}
              currentDate={currentDate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </GridCol>
        </GridRow>
      </>
    </>
  );
}
