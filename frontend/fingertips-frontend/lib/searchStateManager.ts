export const encodedCommaSeperator = encodeURIComponent(',');

export type SearchState = {
  indicator?: string;
  indicatorsSelected?: string[];
};

export class SearchStateManager {
  private searchState: SearchState;

  constructor(searchState: SearchState) {
    this.searchState = {
      indicator: searchState.indicator,
      indicatorsSelected: searchState.indicatorsSelected ?? [],
    };
  }

  private hasState() {
    if (this.searchState.indicator || this.searchState.indicatorsSelected) {
      return true;
    }

    return false;
  }

  private addIndicatorToPath(): string | undefined {
    if (this.searchState.indicator) {
      return `?indicator=${this.searchState.indicator}`;
    }
  }

  private addIndicatorsSelectedToPath(): string | undefined {
    if (
      this.searchState.indicatorsSelected &&
      this.searchState.indicatorsSelected.length > 0
    ) {
      return `&indicatorsSelected=${this.searchState.indicatorsSelected.join(encodedCommaSeperator)}`;
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
    const generatedPath = [];
    generatedPath.push(path);

    if (this.hasState()) {
      generatedPath.push(this.addIndicatorToPath());
      generatedPath.push(this.addIndicatorsSelectedToPath());
    }

    return generatedPath.join('');
  }
}
