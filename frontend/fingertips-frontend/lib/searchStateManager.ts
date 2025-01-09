export const encodedCommaSeperator = encodeURIComponent(',');

export enum SearchParams {
  SearchedIndicator = 'searchedIndicator',
  IndicatorsSelected = 'indicatorsSelected',
}

export type SearchStateParams = {
  [SearchParams.SearchedIndicator]?: string;
  [SearchParams.IndicatorsSelected]?: string;
};

export type SearchState = {
  [SearchParams.SearchedIndicator]?: string;
  [SearchParams.IndicatorsSelected]?: string[];
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
      this.searchStateParams.set(
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
      this.searchStateParams.set(
        SearchParams.IndicatorsSelected,
        this.searchState.indicatorsSelected.join(',')
      );
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

  public static setStateFromParams(params: URLSearchParams) {
    const searchedIndicator =
      params.get(SearchParams.SearchedIndicator) ?? undefined;
    const indicatorsSelected =
      params.get(SearchParams.IndicatorsSelected)?.split(',') ?? [];

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
