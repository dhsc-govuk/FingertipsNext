export const encodedCommaSeperator = encodeURIComponent(',');

export type SearchState = {
  indicator?: string;
  indicatorsSelected?: string[];
};

export class SearchStateManager {
  private searchState: SearchState;
  private generatedPath: string[];

  constructor(searchState: SearchState) {
    this.searchState = {
      indicator: searchState.indicator,
      indicatorsSelected: searchState.indicatorsSelected ?? [],
    };
    this.generatedPath = [];
  }

  private addPathName(pathName: string) {
    this.generatedPath = [];
    this.generatedPath.push(pathName);
  }

  private constructPath() {
    return this.generatedPath.join('');
  }

  private determineQueryPathSymbol() {
    if (this.generatedPath.length === 1) {
      return '?';
    }
    return '&';
  }

  private addIndicatorToPath() {
    if (this.searchState.indicator) {
      this.generatedPath.push(
        `${this.determineQueryPathSymbol()}indicator=${this.searchState.indicator}`
      );
    }
  }

  private addIndicatorsSelectedToPath() {
    if (
      this.searchState.indicatorsSelected &&
      this.searchState.indicatorsSelected.length > 0
    ) {
      this.generatedPath.push(
        `${this.determineQueryPathSymbol()}indicatorsSelected=${this.searchState.indicatorsSelected.join(encodedCommaSeperator)}`
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
    const indicator = params.get('indicator') ?? undefined;
    const indicatorsSelected =
      params.get('indicatorsSelected')?.split(',') ?? [];

    const searchStateManager = new SearchStateManager({
      indicator,
      indicatorsSelected,
    });
    return searchStateManager;
  }

  public generatePath(path: string) {
    this.addPathName(path);

    this.addIndicatorToPath();
    this.addIndicatorsSelectedToPath();

    return this.constructPath();
  }
}
