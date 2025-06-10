--- This stored procedure Gets HealthData and performs Quartile calculations
CREATE PROCEDURE [dbo].[GetIndicatorQuartileDataForLatestYear]
@RequestedAreaType varchar(50),
@RequestedIndicatorIds IndicatorList READONLY,
@RequestedArea varchar(50),
@RequestedAncestorCode varchar(20),
@RequestedBenchmarkCode varchar(20)
--- The area used for benchmarking
AS
BEGIN
    WITH
    --- Get the Benchmark Areas - these are areas of a specific type which are descendants of the benchmark areaGroup
    BenchmarkAreas AS (
    SELECT
        AreaCode
    FROM
	    dbo.FindAreaDescendants_Fn(@RequestedAreaType, @RequestedBenchmarkCode)
    ),
	--- Finds the requested indicators 
	RequestedIndicators AS (
	SELECT
		rii.IndicatorId,
		IndicatorKey,
		Name,
		Polarity
	FROM
		dbo.IndicatorDimension AS ind
	JOIN
	    @RequestedIndicatorIds AS rii
	ON
	    rii.IndicatorId = ind.IndicatorId
    ),
    --- Find the latest year per indictator
    LatestYearPerIndicator AS (
    SELECT
        hm.IndicatorKey,
        MAX(hm.Year) AS LatestYear
    FROM
        dbo.HealthMeasure hm
    JOIN
        RequestedIndicators ri
    ON
        hm.IndicatorKey = ri.IndicatorKey 
    GROUP BY
        hm.IndicatorKey
    ),
    ComparisonArea AS (
    SELECT
        latestYear.IndicatorKey,
        hm.Value
    FROM
        dbo.HealthMeasure AS hm
    JOIN
        dbo.AreaDimension AS areaDim
    ON
        hm.AreaKey = areaDim.AreaKey
    JOIN
        LatestYearPerIndicator AS latestYear
    ON
        latestYear.IndicatorKey = hm.IndicatorKey
    WHERE
        areaDim.Code = @RequestedArea
    AND
        latestYear.LatestYear = hm.Year
    AND
      	(
	        --- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
    ), 
    ComparisonAncestor AS (
    SELECT
        latestYear.IndicatorKey,
        hm.Value
    FROM
        dbo.HealthMeasure AS hm
    JOIN
        dbo.AreaDimension AS areaDim
    ON
        hm.AreaKey = areaDim.AreaKey
    JOIN
        LatestYearPerIndicator AS latestYear
    ON
        latestYear.IndicatorKey = hm.IndicatorKey
    WHERE
        areaDim.Code = @RequestedAncestorCode
    AND
        latestYear.LatestYear = hm.Year
    AND
      	(
	        --- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
    ), 
    EnglandValue AS (
    SELECT
        latestYear.IndicatorKey,
        hm.Value
    FROM
        dbo.HealthMeasure AS hm
    JOIN
        dbo.AreaDimension AS areaDim
    ON
        hm.AreaKey = areaDim.AreaKey
    JOIN
        LatestYearPerIndicator AS latestYear
    ON
        latestYear.IndicatorKey = hm.IndicatorKey
    WHERE
        areaDim.Code = 'E92000001'
    AND
        latestYear.LatestYear = hm.Year
    AND
      	(
	        --- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
    ), 
	--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
	HealthData AS (
	SELECT
	        hm.IndicatorKey,
		    hm.Year,
		    fromDate.Date AS FromDate,
		    toDate.Date AS ToDate,
		    datePeriod.Period AS DatePeriod,
		    NTILE(4) OVER(PARTITION BY hm.Year, hm.indicatorKey ORDER BY hm.Value) AS Quartile,
		    hm.Value
	FROM
		    dbo.HealthMeasure AS hm
	JOIN
            LatestYearPerIndicator AS ind
    ON
		    hm.IndicatorKey = ind.IndicatorKey
	AND
		    hm.Year = ind.LatestYear
	JOIN
            dbo.AreaDimension AS areaDim
    ON
		    hm.AreaKey = areaDim.AreaKey 
	JOIN
	        BenchmarkAreas as ba
	ON
	        areaDim.Code = ba.AreaCode
    JOIN
            dbo.DateDimension AS fromDate
    ON
        	hm.FromDateKey = fromDate.DateKey
    JOIN
            dbo.DateDimension AS toDate
    ON
        	hm.ToDateKey = toDate.DateKey
    JOIN
            dbo.PeriodDimension AS datePeriod
    ON
        	hm.PeriodKey = datePeriod.PeriodKey	        
	WHERE
		(
		--- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
    ),
    --- Calculate Quartiles
    QuartileData AS ( 
    SELECT
        IndicatorKey,
		hd.Year,
	    hd.FromDate,
	    hd.ToDate,
	    hd.DatePeriod,
	    COUNT(*) count,
	    MIN(hd.Value) Minimum,
	    MAX(CASE WHEN hd.Quartile = 1 THEN Value END) Quartile1,
	    MAX(CASE WHEN hd.Quartile = 2 THEN Value END) Median,
	    MAX(CASE WHEN hd.Quartile = 3 THEN Value END) Quartile3,
	    MAX(hd.Value) Maximum
    FROM
		HealthData AS hd
    GROUP BY
	    IndicatorKey, Year, hd.FromDate, hd.ToDate, hd.DatePeriod
	)
	--- Now combine data to return
	SELECT 
	    rii.IndicatorId AS IndicatorId,
	    ri.Polarity AS Polarity,
	    qd.Year AS Year,
		qd.FromDate,
		qd.ToDate,
		qd.DatePeriod AS Period,
	    CASE WHEN qd.count >= 4 THEN qd.Minimum END AS Q0Value,
	    CASE WHEN qd.count >= 4 THEN qd.Quartile1 END AS Q1Value,
	    CASE WHEN qd.count >= 4 THEN qd.Median END AS Q2Value,
	    CASE WHEN qd.count >= 4 THEN qd.Quartile3 END AS Q3Value,
	    CASE WHEN qd.count >= 4 THEN qd.Maximum END AS Q4Value,
	    ca.Value AS AreaValue,
	    ancestor.Value AS AncestorValue,
	    england.Value AS EnglandValue,
	    qd.count AS count
	FROM
        @RequestedIndicatorIds As rii
    LEFT JOIN
	    RequestedIndicators AS ri
    ON 
        rii.IndicatorId = ri.IndicatorId
	LEFT JOIN
	    QuartileData AS qd
	ON
	    qd.IndicatorKey = ri.IndicatorKey
	LEFT JOIN
	    ComparisonArea AS ca
	ON
	    ca.IndicatorKey = ri.IndicatorKey
	LEFT JOIN
	    ComparisonAncestor AS ancestor
	ON
	    ancestor.IndicatorKey = ri.IndicatorKey
	LEFT JOIN
	    EnglandValue AS england
	ON
	    england.IndicatorKey = ri.IndicatorKey
END


