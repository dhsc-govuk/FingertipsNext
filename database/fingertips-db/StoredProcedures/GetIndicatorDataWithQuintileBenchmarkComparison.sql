--- This stored procedure Gets HealthData and performs Quintile calculations
CREATE PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison]
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
		IndicatorKey,
		Name,
		Polarity
	FROM
		dbo.IndicatorDimension AS ind
	WHERE
		ind.IndicatorId = @RequestedIndicatorId
    ),
	--- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
	HealthData AS (
	SELECT
		    hm.HealthMeasureKey,
		    NTILE(5) OVER(PARTITION BY hm.Year ORDER BY	Value) AS Quintile,
		    areaDim.Code AS AreaDimensionCode,
		    areaDim.Name AS AreaDimensionName,
		    sex.Name AS SexDimensionName,
		    sex.HasValue AS SexDimensionHasValue,
				hm.IsSexAggregatedOrSingle AS SexDimensionIsAggregate,
		    trendDim.Name AS TrendDimensionName,
		    ageDim.Name AS AgeDimensionName,
		    ageDim.HasValue AS AgeDimensionHasValue,
				hm.IsAgeAggregatedOrSingle AS AgeDimensionIsAggregate,
		    imd.Name AS DeprivationDimensionName,
		    imd.[Type] AS DeprivationDimensionType,
		    imd.[Sequence] AS DeprivationDimensionSequence,
		    imd.HasValue AS DeprivationDimensionHasValue,
				hm.IsDeprivationAggregatedOrSingle AS DeprivationDimensionIsAggregate,
		    Count,
		    Value,
		    LowerCi,
		    UpperCi,
		    hm.Year
	FROM
		    dbo.HealthMeasure AS hm
	JOIN
        RequestedIndicator AS ind
        ON
		    hm.IndicatorKey = ind.IndicatorKey
	JOIN
            dbo.AreaDimension AS areaDim
        ON
		    hm.AreaKey = areaDim.AreaKey
	JOIN
            dbo.SexDimension AS sex
        ON
		    hm.SexKey = sex.SexKey
	JOIN
            dbo.AgeDimension AS ageDim
        ON
		    hm.AgeKey = ageDim.AgeKey
	JOIN
            dbo.DeprivationDimension AS imd
        ON
		    hm.DeprivationKey = imd.DeprivationKey
    JOIN
            dbo.TrendDimension AS trendDim
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
        --- This is special case handling for data which has a dual identity as both district and county.
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
			        YearNum
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
		hd.HealthMeasureKey,
		hd.Quintile,
		hd.AreaDimensionCode,
		hd.AreaDimensionName,
		hd.SexDimensionName,
		hd.SexDimensionHasValue,
		hd.SexDimensionIsAggregate,
		hd.TrendDimensionName,
		hd.AgeDimensionName,
		hd.AgeDimensionHasValue,
		hd.AgeDimensionIsAggregate,
		hd.DeprivationDimensionName,
		hd.DeprivationDimensionType,
		hd.DeprivationDimensionSequence,
		hd.DeprivationDimensionHasValue,
		hd.DeprivationDimensionIsAggregate,
		hd.Count,
		hd.Value,
		hd.LowerCi,
		hd.UpperCi,
		hd.Year,
		'E92000001' AS BenchmarkComparisonAreaCode,
		'England' AS BenchmarkComparisonAreaName,
		ind.Polarity AS BenchmarkComparisonIndicatorPolarity,
		ind.Name AS IndicatorDimensionName,

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
	END AS BenchmarkComparisonOutcome
FROM
		HealthData AS hd
JOIN
    	@RequestedAreas AS areas
	ON
		hd.AreaDimensionCode = areas.AreaCode
CROSS JOIN
	    RequestedIndicator ind
ORDER BY
		AreaDimensionName,
		hd.Year DESC
END