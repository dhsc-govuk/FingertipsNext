CREATE PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison]
@IndicatorId int,
@AreaCode varchar(max)
AS
BEGIN
	-- This parses the areaCode comma separated list into a structured form
    WITH AreasOfInterest AS (
	    SELECT
		    value as AreaCode
	    FROM
	        STRING_SPLIT(@AreaCode, ',')
	),
	IndicatorOfInterest AS (
	    SELECT
		    y.IndicatorId
	    FROM
		(
	        VALUES (@IndicatorId)) AS y(IndicatorId)
        ),
	--- Need to find the associated AreaType so we can find the full set of areas we are comparing against
	ChosenAreaType AS (
	    SELECT TOP 1
            areas.AreaTypeKey as AreaTypeKey
	    FROM
		    dbo.AreaDimension ad
	    JOIN
            Areas.Areas areas
        ON
		    ad.AreaKey = areas.AreaKey
	    JOIN
            AreasOfInterest aoi
        ON
		    ad.Code = aoi.AreaCode 
    ),
	--- Need to find the latest year for which we have data.
	IndicatorData AS (
	    SELECT
		    Max(Year) as LatestYear,
		    'High is better' as Polarity
	    FROM
		    dbo.HealthMeasure as hm
	    JOIN
            dbo.IndicatorDimension as ind
        ON
		    hm.IndicatorKey = ind.IndicatorKey
	    JOIN 
            IndicatorOfInterest ioi
        ON
		    ind.IndicatorId = ioi.IndicatorId
        ),
	--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points. Also needs to be for the latest year
	AreaTypeGroup AS (
	    SELECT
		    hm.HealthMeasureKey,
		    NTILE(5) OVER(ORDER BY Value) AS Quintile,
		    area.Code as AreaDimensionCode,
		    area.Name as AreaDimensionName,
		    ind.Name as IndicatorDimensionName,
		    sex.SexKey as SexDimensionName,
		    sex.HasValue as SexDimensionHasValue,
		    'trendName' as TrendDimensionName,
		    age.Name as AgeDimensionName,
		    age.HasValue as AgeDimensionHasValue,
		    imd.Name as DeprivationDimensionName,
		    imd.[Type] as DeprivationDimensionType,
		    imd.[Sequence] as DeprivationDimensionSequence,
		    imd.HasValue as DeprivationDimentionHasValue,
		    Count,
		    Value,
		    LowerCi,
		    UpperCi,
		    hm.Year,
		    indData.Polarity as IndicatorPolarity
	    FROM
		    dbo.HealthMeasure as hm
    	JOIN
            dbo.IndicatorDimension ind
        ON
		    hm.IndicatorKey = ind.IndicatorKey
	    JOIN
            dbo.AreaDimension as area
        ON
		    hm.AreaKey = area.AreaKey
	    JOIN
            Areas.Areas aa
        ON
		    aa.AreaKey = area.AreaKey
	    JOIN
            dbo.SexDimension as sex
        ON
		    hm.SexKey = sex.SexKey
	    JOIN
            dbo.AgeDimension as age
        ON
		    hm.AgeKey = age.AgeKey
    	JOIN
            dbo.DeprivationDimension as imd
        ON
		    hm.DeprivationKey = imd.DeprivationKey
	    JOIN
            ChosenAreaType as at 
        ON
		    at.AreaTypeKey = aa.AreaTypeKey
	    JOIN
            IndicatorData as indData
        ON
		    hm.Year = indData.LatestYear
    	JOIN 
            IndicatorOfInterest ioi
        ON
		    ind.IndicatorId = ioi.IndicatorId
    	WHERE
	    	age.hasValue = 0
		--- todo this is an incomplete solution
		AND
            sex.hasValue = 0
		--- todo this is an incomplete solution
		AND
            imd.hasValue = 0
		--- todo this is an incomplete solution
    )
    SELECT
		*,
		'Quintile' as BenchmarkComparisonMethod,
		'E92000001' as BenchmarkComparisonAreaCode,
		'England' as BenchmarkComparisonAreaName,
		atg.IndicatorPolarity as BenchmarkComparisonIndicatorPolarity,
	CASE
		WHEN atg.IndicatorPolarity = 'High is better'
		AND atg.Quintile = 1 THEN 'LOWEST'
		WHEN atg.IndicatorPolarity = 'High is better'
		AND atg.Quintile = 2 THEN 'LOWER'
		WHEN atg.IndicatorPolarity = 'High is better'
		AND atg.Quintile = 3 THEN 'SIMILAR'
		WHEN atg.IndicatorPolarity = 'High is better'
		AND atg.Quintile = 4 THEN 'HIGHER'
		WHEN atg.IndicatorPolarity = 'High is better'
		AND atg.Quintile = 5 THEN 'HIGHEST'
	END as BenchmarkComparisonOutcome
	FROM
		AreaTypeGroup as atg
	JOIN
    	AreasOfInterest as aoi
	ON
		atg.AreaDimensionCode = aoi.AreaCode
	ORDER BY
		AreaDimensionName
END