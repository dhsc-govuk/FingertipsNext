--- This stored procedure Gets HealthData and performs Quintile calculations
CREATE PROCEDURE [dbo].[ggit status]
@RequestedAreas AreaCodeList READONLY,
--- The Areas we want data for
@RequestedAreaType varchar(50),
--- The AreaType we are comparing against - this needs to be passed in because the AreaCodes can be ambiguous for districts and counties
@RequestedYears YearList READONLY,
--- The Years we are interested in - can be empty
@RequestedIndicatorId int
--- The specific indicatorId we are interested in
AS
BEGIN
	WITH
	--- Finds the indicator of interest from the passed in IndicatorId.
	RequestedIndicator AS (
	SELECT
		*
	FROM
		dbo.IndicatorDimension as ind
	WHERE 
		ind.IndicatorId = @RequestedIndicatorId
    ),
	--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
	HealthData AS (
	SELECT
		    hm.HealthMeasureKey,
		    NTILE(5) OVER(PARTITION BY hm.Year
	ORDER BY
		Value) AS Quintile,
		    areaDim.Code as AreaDimensionCode,
		    areaDim.Name as AreaDimensionName,
		    sex.Name as SexDimensionName,
		    sex.HasValue as SexDimensionHasValue,
		    trendDim.Name as TrendDimensionName,
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
            RequestedIndicator as ind
        ON
		    hm.IndicatorKey = ind.IndicatorKey
	JOIN
            dbo.AreaDimension as areaDim
        ON
		    hm.AreaKey = areaDim.AreaKey
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
    JOIN
            dbo.TrendDimension as trendDim
        ON
            hm.TrendKey = trendDim.TrendKey
	WHERE
		(
		--- This ensures we are only dealing with Aggregate data
	        hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
	    )
        AND
        (
            areaDim.AreaType = @RequestedAreaType
        --- This is special case handling for data which has a dual identify as both district and county.
            OR 
			(
               @RequestedAreaType = 'districts-and-unitary-authorities'
               AND 
			   IsDistrictAndCounty = 1
            )
        )
		AND
        (
            hm.Year IN (
		        SELECT
			        *
		        FROM
			        @RequestedYears
			)
		    OR NOT EXISTS (
		    --- If no years are passed in then return data for ALL years
		        SELECT
			        1
		        FROM
			       @RequestedYears
			)
        )
    )
    --- The final select now filters based on the requested areas and calculates the Benchmark outcome
    SELECT
		*,
		'E92000001' as BenchmarkComparisonAreaCode,
		'England' as BenchmarkComparisonAreaName,
		ind.Polarity as BenchmarkComparisonIndicatorPolarity,
		ind.Name as IndicatorDimensionName,

	CASE
		WHEN ind.Polarity = 'High is good'
		AND hd.Quintile = 1 THEN 'WORST'
		WHEN ind.Polarity = 'High is good'
		AND hd.Quintile = 2 THEN 'WORSE'
		WHEN ind.Polarity = 'High is good'
		AND hd.Quintile = 3 THEN 'MIDDLE'
		WHEN ind.Polarity = 'High is good'
		AND hd.Quintile = 4 THEN 'BETTER'
		WHEN ind.Polarity = 'High is good'
		AND hd.Quintile = 5 THEN 'BEST'

		WHEN ind.Polarity = 'Low is good'
		AND hd.Quintile = 1 THEN 'BEST'
		WHEN ind.Polarity = 'Low is good'
		AND hd.Quintile = 2 THEN 'BETTER'
		WHEN ind.Polarity = 'Low is good'
		AND hd.Quintile = 3 THEN 'MIDDLE'
		WHEN ind.Polarity = 'Low is good'
		AND hd.Quintile = 4 THEN 'WORSE'
		WHEN ind.Polarity = 'Low is good'
		AND hd.Quintile = 5 THEN 'WORST'

		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 1 THEN 'LOWEST'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 2 THEN 'LOWER'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 3 THEN 'SIMILAR'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 4 THEN 'HIGHER'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 5 THEN 'HIGHEST'
	END as BenchmarkComparisonOutcome
FROM
		HealthData as hd
JOIN
    	@RequestedAreas as areas
	ON
		hd.AreaDimensionCode = areas.AreaCode
CROSS JOIN
	    RequestedIndicator ind
ORDER BY
		AreaDimensionName, 
		hd.Year DESC
END