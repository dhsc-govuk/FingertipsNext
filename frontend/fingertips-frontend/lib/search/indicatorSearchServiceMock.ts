import { IndicatorMapper } from './indicatorMapper';
import {
  IIndicatorSearchService,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';

export class IndicatorSearchServiceMock implements IIndicatorSearchService {
  private readonly mockIndicatorData: RawIndicatorDocument[];
  private readonly mapper: IndicatorMapper;

  constructor(indicatorData: RawIndicatorDocument[]) {
    this.mockIndicatorData = indicatorData;
    this.mapper = new IndicatorMapper();
  }

  public async searchWith(
    searchText: string,
    isEnglandSelectedAsGroup: boolean,
    areaCodes: string[]
  ): Promise<IndicatorDocument[]> {
    const trimmedSearchText = searchText.trim();

    const searchResults = this.mockIndicatorData
      .filter((indicator) => {
        // Check if searched for text is a space-separated list of numbers
        const spaceSeparatedPattern = /^\d+(\s+\d+)+$/;
        if (spaceSeparatedPattern.test(trimmedSearchText)) {
          // Parse indicator IDs and match exactly
          const indicatorIds = trimmedSearchText
            .split(/\s+/)
            .filter((id) => id.length > 0);
          return indicatorIds.includes(indicator.indicatorID);
        }

        // Default behavior: fuzzy search
        const lowerSearchText = trimmedSearchText.toLowerCase();
        return (
          indicator.indicatorID.toLowerCase().includes(lowerSearchText) ||
          indicator.indicatorName.toLowerCase().includes(lowerSearchText) ||
          indicator.indicatorDefinition.toLowerCase().includes(lowerSearchText)
        );
      })
      .filter((indicator) => {
        return (
          !areaCodes ||
          indicator.associatedAreaCodes.some((area) =>
            areaCodes
              .map((areaCode) => areaCode.toLowerCase())
              .includes(area.toLowerCase())
          )
        );
      });

    return this.mapper.toEntities(
      searchResults,
      areaCodes ?? [],
      isEnglandSelectedAsGroup
    );
  }

  public async getIndicator(
    indicatorId: string
  ): Promise<IndicatorDocument | undefined> {
    const rawDocument = this.mockIndicatorData.find((indicator) => {
      return indicator.indicatorID.toLowerCase() === indicatorId.toLowerCase();
    });

    // This restricts the return to _only_ the fields we index in actual AI search
    // otherwise the mock would return extra fields that aren't currently populated

    if (!rawDocument) {
      return undefined;
    }

    return {
      indicatorID: rawDocument.indicatorID,
      indicatorName: rawDocument.indicatorName,
      indicatorDefinition: rawDocument?.indicatorDefinition,
      earliestDataPeriod: rawDocument.earliestDataPeriod,
      latestDataPeriod: rawDocument.latestDataPeriod,
      lastUpdatedDate: rawDocument.lastUpdatedDate,
      dataSource: rawDocument.dataSource,
      hasInequalities: rawDocument.hasInequalities,
      trend: undefined,
      unitLabel: rawDocument.unitLabel,
    };
  }
}
