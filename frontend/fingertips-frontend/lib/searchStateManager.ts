export const encodedCommaSeperator = encodeURIComponent(',');

export class SearchStateManager {
  private indicator: string | undefined | null;
  private indicatorsSelected: string[] | undefined | null;

  constructor(indicator?: string, indicatorsSelected?: string[]) {
    this.indicator = indicator;
    this.indicatorsSelected = indicatorsSelected ?? [];
  }

  private hasState() {
    if (this.indicator || this.indicatorsSelected) {
      return true;
    }

    return false;
  }

  private addIndicatorToPath(): string | undefined {
    if (this.indicator) {
      return `?indicator=${this.indicator}`;
    }
  }

  private addIndicatorsSelectedToPath(): string | undefined {
    if (this.indicatorsSelected && this.indicatorsSelected.length > 0) {
      return `&indicatorsSelected=${this.indicatorsSelected.join(encodedCommaSeperator)}`;
    }
  }

  public addIndicatorSelected(indicatorId: string) {
    this.indicatorsSelected?.push(indicatorId);
  }

  public removeIndicatorSelected(indicatorId: string) {
    this.indicatorsSelected = this.indicatorsSelected?.filter((ind) => {
      return ind !== indicatorId;
    });
  }

  public setStateFromParams(params: URLSearchParams) {
    this.indicator = params.get('indicator');
    this.indicatorsSelected =
      params.get('indicatorsSelected')?.split(encodedCommaSeperator) ?? [];
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
