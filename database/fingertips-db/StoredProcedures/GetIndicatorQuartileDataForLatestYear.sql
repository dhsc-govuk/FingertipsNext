--- This stored procedure Gets HealthData and performs Quartile calculations
CREATE PROCEDURE [dbo].[GetIndicatorQuartileDataForLatestYear] @RequestedAreaType varchar(50),
@RequestedIndicatorIds IndicatorList READONLY,
@RequestedArea varchar(50),
@RequestedAncestorCode varchar(20),
@RequestedBenchmarkCode varchar(20), --- The area used for benchmarking
@IncludeUnpublishedData BIT
AS BEGIN
DECLARE @DateBefore AS DATETIME2;

--IF we don't want to include unpblished data we want data that has a published date in the past
--IF we do want unpublished data we want data older than 10 years in the future - same as all dates
IF @IncludeUnpublishedData = 0
	SET @DateBefore = GETUTCDATE();
ELSE
	SET @DateBefore = DateAdd(yy, 10, GETDATE());

WITH --- Get the Benchmark Areas - these are areas of a specific type which are descendants of the benchmark areaGroup
BenchmarkAreas AS (
    SELECT AreaCode
    FROM dbo.FindAreaDescendants_Fn(@RequestedAreaType, @RequestedBenchmarkCode)
),
--- Finds the requested indicators 
RequestedIndicators AS (
    SELECT rii.IndicatorId,
        IndicatorKey,
        Name,
        Polarity
    FROM dbo.IndicatorDimension AS ind
        JOIN @RequestedIndicatorIds AS rii ON rii.IndicatorId = ind.IndicatorId
),
--- Find each segment for each indicator - initially PeriodSegments supported
IndicatorSegments AS (
    SELECT DISTINCT hm.IndicatorKey,
        hm.PeriodKey
    FROM dbo.HealthMeasure AS hm
        JOIN RequestedIndicators AS ri ON hm.IndicatorKey = ri.IndicatorKey
),
--- Find the latest year per indictator segment
LatestDatePerIndicatorSegment AS (
    SELECT hm.IndicatorKey,
        hm.PeriodKey,
        MAX(hm.FromDateKey) AS LatestFromDateKey
    FROM indicatorSegments AS indSeg
        JOIN dbo.HealthMeasure hm ON hm.IndicatorKey = indSeg.IndicatorKey
        AND hm.PeriodKey = indSeg.PeriodKey
    WHERE hm.PublishedAt <= @DateBefore
    GROUP BY hm.IndicatorKey,
        hm.PeriodKey
),
ComparisonAreaValue AS (
    SELECT latestDatePerSegment.IndicatorKey,
        latestDatePerSegment.PeriodKey,
        hm.Value
    FROM dbo.HealthMeasure AS hm
        JOIN dbo.AreaDimension AS areaDim ON hm.AreaKey = areaDim.AreaKey
        JOIN LatestDatePerIndicatorSegment AS latestDatePerSegment ON latestDatePerSegment.IndicatorKey = hm.IndicatorKey
        AND latestDatePerSegment.PeriodKey = hm.PeriodKey
        AND latestDatePerSegment.LatestFromDateKey = hm.FromDateKey
    WHERE areaDim.Code = @RequestedArea
        AND (
            --- This ensures we are only dealing with Aggregate data
            hm.IsSexAggregatedOrSingle = 1
            AND hm.IsAgeAggregatedOrSingle = 1
            AND hm.IsDeprivationAggregatedOrSingle = 1
        )
        AND hm.PublishedAt <= @DateBefore
),
ComparisonAncestor AS (
    SELECT latestDatePerSegment.IndicatorKey,
        latestDatePerSegment.PeriodKey,
        hm.Value
    FROM dbo.HealthMeasure AS hm
        JOIN dbo.AreaDimension AS areaDim ON hm.AreaKey = areaDim.AreaKey
        JOIN LatestDatePerIndicatorSegment AS latestDatePerSegment ON latestDatePerSegment.IndicatorKey = hm.IndicatorKey
        AND latestDatePerSegment.PeriodKey = hm.PeriodKey
        AND latestDatePerSegment.LatestFromDateKey = hm.FromDateKey
    WHERE areaDim.Code = @RequestedAncestorCode
        AND (
            --- This ensures we are only dealing with Aggregate data
            hm.IsSexAggregatedOrSingle = 1
            AND hm.IsAgeAggregatedOrSingle = 1
            AND hm.IsDeprivationAggregatedOrSingle = 1
        )
        AND hm.PublishedAt <= @DateBefore
),
EnglandValue AS (
    SELECT latestDatePerSegment.IndicatorKey,
        latestDatePerSegment.PeriodKey,
        hm.Value
    FROM dbo.HealthMeasure AS hm
        JOIN dbo.AreaDimension AS areaDim ON hm.AreaKey = areaDim.AreaKey
        JOIN LatestDatePerIndicatorSegment AS latestDatePerSegment ON latestDatePerSegment.IndicatorKey = hm.IndicatorKey
        AND latestDatePerSegment.PeriodKey = hm.PeriodKey
        AND latestDatePerSegment.LatestFromDateKey = hm.FromDateKey
    WHERE areaDim.Code = 'E92000001'
        AND (
            --- This ensures we are only dealing with Aggregate data
            hm.IsSexAggregatedOrSingle = 1
            AND hm.IsAgeAggregatedOrSingle = 1
            AND hm.IsDeprivationAggregatedOrSingle = 1
        )
        AND hm.PublishedAt <= @DateBefore
),
--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
HealthData AS (
    SELECT hm.IndicatorKey,
        hm.Year,
        fromDate.Date AS FromDate,
        toDate.Date AS ToDate,
        datePeriod.Period AS DatePeriod,
        NTILE(4) OVER(
            PARTITION BY hm.indicatorKey,
            fromDate.Date,
            toDate.Date
            ORDER BY hm.Value
        ) AS Quartile,
        hm.Value
    FROM dbo.HealthMeasure AS hm
        JOIN LatestDatePerIndicatorSegment AS indSeg ON hm.IndicatorKey = indSeg.IndicatorKey
        AND hm.PeriodKey = indSeg.PeriodKey
        AND hm.FromDateKey = indSeg.LatestFromDateKey
        JOIN dbo.AreaDimension AS areaDim ON hm.AreaKey = areaDim.AreaKey
        JOIN BenchmarkAreas AS ba ON areaDim.Code = ba.AreaCode
        JOIN dbo.DateDimension AS fromDate ON hm.FromDateKey = fromDate.DateKey
        JOIN dbo.DateDimension AS toDate ON hm.ToDateKey = toDate.DateKey
        JOIN dbo.PeriodDimension AS datePeriod ON hm.PeriodKey = datePeriod.PeriodKey
    WHERE (
            --- This ensures we are only dealing with Aggregate data
            hm.IsSexAggregatedOrSingle = 1
            AND hm.IsAgeAggregatedOrSingle = 1
            AND hm.IsDeprivationAggregatedOrSingle = 1
        )
        AND hm.PublishedAt <= @DateBefore
),
--- Calculate Quartiles
QuartileData AS (
    SELECT IndicatorKey,
        hd.Year,
        hd.FromDate,
        hd.ToDate,
        hd.DatePeriod,
        COUNT(*) QuartileCount,
        MIN(hd.Value) Minimum,
        MAX(
            CASE
                WHEN hd.Quartile = 1 THEN Value
            END
        ) Quartile1,
        MAX(
            CASE
                WHEN hd.Quartile = 2 THEN Value
            END
        ) Median,
        MAX(
            CASE
                WHEN hd.Quartile = 3 THEN Value
            END
        ) Quartile3,
        MAX(hd.Value) Maximum
    FROM HealthData AS hd
    GROUP BY IndicatorKey,
        hd.FromDate,
        hd.ToDate,
        hd.DatePeriod,
        hd.Year
) --- Now combine data to return
SELECT rii.IndicatorId AS IndicatorId,
    ri.Polarity AS Polarity,
    qd.Year AS Year,
    qd.FromDate,
    qd.ToDate,
    qd.DatePeriod AS Period,
    CASE
        WHEN qd.QuartileCount >= 4 THEN qd.Minimum
    END AS Q0Value,
    CASE
        WHEN qd.QuartileCount >= 4 THEN qd.Quartile1
    END AS Q1Value,
    CASE
        WHEN qd.QuartileCount >= 4 THEN qd.Median
    END AS Q2Value,
    CASE
        WHEN qd.QuartileCount >= 4 THEN qd.Quartile3
    END AS Q3Value,
    CASE
        WHEN qd.QuartileCount >= 4 THEN qd.Maximum
    END AS Q4Value,
    ca.Value AS AreaValue,
    ancestor.Value AS AncestorValue,
    england.Value AS EnglandValue,
    qd.QuartileCount
FROM @RequestedIndicatorIds AS rii
    LEFT JOIN RequestedIndicators AS ri ON rii.IndicatorId = ri.IndicatorId
    LEFT JOIN QuartileData AS qd ON qd.IndicatorKey = ri.IndicatorKey
    LEFT JOIN ComparisonAreaValue AS ca ON ca.IndicatorKey = ri.IndicatorKey
    LEFT JOIN ComparisonAncestor AS ancestor ON ancestor.IndicatorKey = ri.IndicatorKey
    LEFT JOIN EnglandValue AS england ON england.IndicatorKey = ri.IndicatorKey
ORDER BY 
    rii.IndicatorId
END