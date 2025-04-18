--- This stored procedure Gets HealthData and performs Quintile calculations
CREATE PROCEDURE [dbo].[GetIndicatorQuartileDataForLatestYear]
@RequestedAreaType varchar(50),
@RequestedIndicatorIds IndicatorList READONLY,
@RequestedArea varchar(50),
@RequestedAncestor varchar(50)
AS
BEGIN
	WITH
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
        areaDim.Code = @RequestedAncestor
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
		    NTILE(4) OVER(PARTITION BY hm.Year, hm.indicatorKey ORDER BY Value) AS Quartile,
		    Value
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
	WHERE
		(
		--- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
        AND
        (
            areaDim.AreaType = @RequestedAreaType
        --- This is special case handling for data which has a dual identity as both district and county.
            OR 
			(
               @RequestedAreaType = 'districts-and-unitary-authorities'
               AND 
			   IsDistrictAndCounty = 1
            )
        )
    ),
    --- Calculate Quartiles
    QuartileData AS ( 
    SELECT
        IndicatorKey,
		hd.Year,
	    COUNT(*) count,
	    MIN(hd.Value) Minimum,
	    MAX(CASE WHEN hd.Quartile = 1 THEN Value END) Quartile1,
	    MAX(CASE WHEN hd.Quartile = 2 THEN Value END) Median,
	    MAX(CASE WHEN hd.Quartile = 3 THEN Value END) Quartile3,
	    MAX(hd.Value) Maximum
    FROM
		HealthData AS hd
    GROUP BY
	    IndicatorKey, Year
	)
	--- Now combine data to return
	SELECT 
	    rii.IndicatorId AS IndicatorId,
	    ri.Polarity AS Polarity,
	    qd.Year AS Year,
	    CASE WHEN qd.count >= 4 THEN qd.Minimum END AS Q0Value,
	    CASE WHEN qd.count >= 4 THEN qd.Quartile1 END AS Q1Value,
	    CASE WHEN qd.count >= 4 THEN qd.Median END AS Q2Value,
	    CASE WHEN qd.count >= 4 THEN qd.Quartile3 END AS Q3Value,
	    CASE WHEN qd.count >= 4 THEN qd.Maximum END AS Q4Value,
	    ca.Value AS AreaValue,
	    ancestor.Value AS AncestorValue,
	    england.Value AS EnglandValue
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
	    qd.IndicatorKey = ca.IndicatorKey
	LEFT JOIN
	    ComparisonAncestor AS ancestor
	ON
	    qd.IndicatorKey = ancestor.IndicatorKey	
	LEFT JOIN
	    EnglandValue AS england
	ON
	    qd.IndicatorKey = england.IndicatorKey
END


