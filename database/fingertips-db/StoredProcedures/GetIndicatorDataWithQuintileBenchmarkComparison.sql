--- This stored procedure Gets HealthData and performs Quintile calculations
CREATE PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison]
@AreasOfInterest AreaCodeList READONLY, --- The Areas we want data for
@AreaTypeOfInterest varchar(50),        --- The AreaType we are comparing against - this needs to be passed in because the AreaCodes can be ambiguous for districts and counties
@YearsOfInterest YearList READONLY,     --- The Years we are interested in - can be empty
@IndicatorId int                        --- The specific indicatorId we are interested in
AS
BEGIN
    WITH 	
    --- Finds the indicator of interest from the passed in IndicatorId.
	IndicatorOfInterest AS (
	    SELECT
		    *
	    FROM
            dbo.IndicatorDimension as ind
 	    WHERE 
		    ind.IndicatorId = @IndicatorId
    ),
	--- Converts the scalar value AreaTypeKey into a table value form
	ChosenAreaType AS (
        SELECT AreaTypeKey  FROM (VALUES (@AreaTypeOfInterest) ) AS MyTable(AreaTypeKey)
    ),
    --- This is used to help identify data with inequality dimensions set but IS STILL an aggregate value. This is the case for indicators like People over 65 who are admitted to hospital. 
    InequalityDimensionDistinctValueCount AS (
        SELECT 
            COUNT(DISTINCT hm.SexKey) AS SexKeyCount, 
            COUNT(DISTINCT hm.AgeKey) AS AgeKeyCount, 
            COUNT(DISTINCT hm.DeprivationKey) AS DeprivationKeyCount
        FROM 
            dbo.HealthMeasure hm
	    JOIN
            dbo.IndicatorDimension as ind
        ON
		    hm.IndicatorKey = ind.IndicatorKey            
	    JOIN 
            IndicatorOfInterest ioi
        ON
		    ind.IndicatorId = ioi.IndicatorId    
    ),
	--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
	HealthData AS (
	    SELECT
		    hm.HealthMeasureKey,
		    NTILE(5) OVER(PARTITION BY hm.Year ORDER BY Value) AS Quintile,
		    area.Code as AreaDimensionCode,
		    area.Name as AreaDimensionName,
		    sex.Name as SexDimensionName,
		    sex.HasValue as SexDimensionHasValue,
		    'trendName' as TrendDimensionName,
		    ageDim.Name as AgeDimensionName,
		    ageDim.HasValue as AgeDimensionHasValue,
		    imd.Name as DeprivationDimensionName,
		    imd.[Type] as DeprivationDimensionType,
		    imd.[Sequence] as DeprivationDimensionSequence,
		    imd.HasValue as DeprivationDimensionHasValue,
		    Count,
		    Value,
		    LowerCi,
		    UpperCi,
		    hm.Year
	    FROM
		    dbo.HealthMeasure as hm
    	JOIN
            IndicatorOfInterest as ind
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
            ChosenAreaType as at2 
        ON
		    at2.AreaTypeKey = aa.AreaTypeKey
		JOIN
            dbo.SexDimension as sex
        ON
		    hm.SexKey = sex.SexKey
	    JOIN
            dbo.AgeDimension as ageDim
        ON
		    hm.AgeKey = ageDim.AgeKey
    	JOIN
            dbo.DeprivationDimension as imd
        ON
		    hm.DeprivationKey = imd.DeprivationKey
		CROSS JOIN
		    InequalityDimensionDistinctValueCount iddvc
    	WHERE
    	(
	        ageDim.hasValue = 0
	    OR
	        iddvc.AgeKeyCount = 1
	    )
		AND
		(
            sex.hasValue = 0
        OR
            iddvc.SexKeyCount = 1
        )
		AND
		(
            imd.hasValue = 0
        OR
            iddvc.DeprivationKeyCount = 1
        )
        AND
        (
            hm.Year IN (SELECT * FROM @YearsOfInterest)
		OR
		    NOT EXISTS (SELECT 1 FROM @YearsOfInterest)
        )
    )
    SELECT
		*,
		'Quintile' as BenchmarkComparisonMethod,
		'E92000001' as BenchmarkComparisonAreaCode,
		'England' as BenchmarkComparisonAreaName,
		ioi.Polarity as BenchmarkComparisonIndicatorPolarity,
		ioi.Name as IndicatorDimensionName,

	CASE
		WHEN ioi.IndicatorPolarity = 'High is good'
		AND hd.Quintile = 1 THEN 'WORST'
		WHEN ioi.IndicatorPolarity = 'High is good'
		AND hd.Quintile = 2 THEN 'WORSE'
		WHEN ioi.IndicatorPolarity = 'High is good'
		AND hd.Quintile = 3 THEN 'MIDDLE'
		WHEN ioi.IndicatorPolarity = 'High is good'
		AND hd.Quintile = 4 THEN 'BETTER'
		WHEN ioi.IndicatorPolarity = 'High is good'
		AND hd.Quintile = 5 THEN 'BEST'

		WHEN ioi.IndicatorPolarity = 'Low is good'
		AND hd.Quintile = 1 THEN 'BEST'
		WHEN ioi.IndicatorPolarity = 'Low is good'
		AND hd.Quintile = 2 THEN 'BETTER'
		WHEN ioi.IndicatorPolarity = 'Low is good'
		AND hd.Quintile = 3 THEN 'MIDDLE'
		WHEN ioi.IndicatorPolarity = 'Low is good'
		AND hd.Quintile = 4 THEN 'WORSE'
		WHEN ioi.IndicatorPolarity = 'Low is good'
		AND hd.Quintile = 5 THEN 'WORST'

		WHEN ioi.IndicatorPolarity = 'No judgement'
		AND hd.Quintile = 1 THEN 'LOWEST'
		WHEN ioi.IndicatorPolarity = 'No judgement'
		AND hd.Quintile = 2 THEN 'LOWER'
		WHEN ioi.IndicatorPolarity = 'No judgement'
		AND hd.Quintile = 3 THEN 'SIMILAR'
		WHEN ioi.IndicatorPolarity = 'No judgement'
		AND hd.Quintile = 4 THEN 'HIGHER'
		WHEN ioi.IndicatorPolarity = 'No judgement'
		AND hd.Quintile = 5 THEN 'HIGHEST'
	END as BenchmarkComparisonOutcome
	FROM
		HealthData as hd
	JOIN
    	@AreasOfInterest as aoi
	ON
		hd.AreaDimensionCode = aoi.AreaCode
	CROSS JOIN
	    IndicatorOfInterest ioi
	ORDER BY
		AreaDimensionName, 
		hd.Year DESC
END