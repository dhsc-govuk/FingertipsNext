export function parseIndicatorData(rawIndicatorData) {
    const unparsedIndicatorData = rawIndicatorData;
    const parseIndicatorData = unparsedIndicatorData.map(({ indicatorID, indicatorName, earliestDataPeriod, latestDataPeriod, lastUpdatedDate, indicatorDefinition, dataSource, associatedAreaCodes, trendsByArea, hasInequalities, unitLabel, }) => {
        return {
            indicatorID: String(indicatorID),
            indicatorName,
            indicatorDefinition,
            dataSource,
            earliestDataPeriod: String(earliestDataPeriod),
            latestDataPeriod: String(latestDataPeriod),
            lastUpdatedDate: new Date(lastUpdatedDate),
            associatedAreaCodes,
            trendsByArea,
            hasInequalities,
            unitLabel,
        };
    });
    return parseIndicatorData;
}
