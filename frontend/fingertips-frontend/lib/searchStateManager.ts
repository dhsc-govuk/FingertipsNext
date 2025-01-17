export enum SearchParams {
  SearchedIndicator = 'si',
  IndicatorsSelected = 'is',
  AreasSelected = 'as',
}

export type SearchStateParams = {
  [SearchParams.SearchedIndicator]?: string;
  [SearchParams.IndicatorsSelected]?: string | string[];
  [SearchParams.AreasSelected]?: string | string[];
};

export type SearchState = {
  searchedIndicator?: string;
  indicatorsSelected?: string[];
  areasSelected?: string[];
};

export class SearchStateManager {
  private searchState: SearchState;
  private searchStateParams: URLSearchParams;

  constructor(searchState: SearchState) {
    this.searchState = {
      searchedIndicator: searchState.searchedIndicator,
      indicatorsSelected: searchState.indicatorsSelected ?? [],
    };
    this.searchStateParams = new URLSearchParams();
  }

  private constructPath(path: string) {
    if (this.searchStateParams.size === 0) {
      return path;
    }
    return `${path}?${this.searchStateParams.toString()}`;
  }

  private addSearchedIndicatorToPath() {
    if (this.searchState.searchedIndicator) {
      this.searchStateParams.append(
        SearchParams.SearchedIndicator,
        this.searchState.searchedIndicator
      );
    }
  }

  private addIndicatorsSelectedToPath() {
    if (
      this.searchState.indicatorsSelected &&
      this.searchState.indicatorsSelected.length > 0
    ) {
      this.searchState.indicatorsSelected?.forEach((indicator) => {
        this.searchStateParams.append(
          SearchParams.IndicatorsSelected,
          indicator
        );
      });
    }
  }

  public addIndicatorSelected(indicatorId: string) {
    this.searchState.indicatorsSelected?.push(indicatorId);
  }

  public removeIndicatorSelected(indicatorId: string) {
    this.searchState = {
      ...this.searchState,
      indicatorsSelected: this.searchState.indicatorsSelected?.filter((ind) => {
        return ind !== indicatorId;
      }),
    };
  }

  public removeAllIndicatorSelected() {
    this.searchState = {
      ...this.searchState,
      indicatorsSelected: [],
    };
  }

  public static setStateFromParams(params: URLSearchParams) {
    const searchedIndicator =
      params.get(SearchParams.SearchedIndicator) ?? undefined;
    const indicatorsSelected =
      params.getAll(SearchParams.IndicatorsSelected) ?? [];

    const searchStateManager = new SearchStateManager({
      searchedIndicator,
      indicatorsSelected,
    });
    return searchStateManager;
  }

  public generatePath(path: string) {
    this.searchStateParams = new URLSearchParams();

    this.addSearchedIndicatorToPath();
    this.addIndicatorsSelectedToPath();

    return this.constructPath(path);
  }
}
