--- This stored procedure gets HealthData and performs Quintile calculations
CREATE PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison] --- The Areas we want data for
@RequestedAreas AreaCodeList READONLY,
--- The AreaType we are comparing against - this needs to be passed in because the AreaCodes can be ambiguous for districts and counties
@RequestedAreaType varchar(50),
--- The Years we are interested in - can be empty - DEPRECATED
@RequestedYears YearList READONLY,
--- The specific indicatorId we are interested in
@RequestedIndicatorId int,
--- The area used for benchmarking
@RequestedBenchmarkAreaCode varchar(20),
--- The inclusive date range we are interested in - can be empty
@RequestedFromDate DATE,
@RequestedToDate DATE,
@IncludeUnpublishedData BIT
AS BEGIN
DECLARE @DateBefore AS DATETIME2;

--IF we don't want to include unpublished data we want data that has a published date in the past
--IF we do want unpublished data we want data older than 10 years in the future - same as all dates
IF @IncludeUnpublishedData = 0
	SET @DateBefore = GETUTCDATE();
ELSE
	SET @DateBefore = DateAdd(yy, 10, GETDATE());

WITH --- Get the Benchmark Area
BenchmarkAreaGroup AS (
	SELECT 
		*
	FROM
		dbo.AreaDimension AS areaDim
	WHERE
		areaDim.Code = @RequestedBenchmarkAreaCode
),
--- Finds the indicator of interest from the passed in IndicatorId.
RequestedIndicator AS (
	SELECT
		IndicatorKey,
		Name,
		Polarity,
		PeriodType,
		CollectionFrequency
	FROM
		dbo.IndicatorDimension AS ind
	WHERE
		ind.IndicatorId = @RequestedIndicatorId
),
--- The set of areas used for the Quintile calculation - these are the descendants of the requested benchmark area
BenchmarkDescendants AS (
	SELECT
		AreaCode
	FROM
		dbo.FindAreaDescendants_Fn(@RequestedAreaType, @RequestedBenchmarkAreaCode)
),
--- We want to return data for all areas but only calculate the quintiles for the benchmark area and its descendants
AreasWithIsBenchmarkAreaFlag (AreaCode, IsBenchmarkArea) AS (
	SELECT 
		AreaCode,
		1
	FROM
		BenchmarkDescendants
	UNION
	SELECT 
		ra.AreaCode,
		0
	FROM
		@RequestedAreas ra
	JOIN
		dbo.AreaDimension ad ON ra.AreaCode = ad.Code
	WHERE
		ra.AreaCode NOT IN 
		(
			SELECT 
				AreaCode
			FROM
				BenchmarkDescendants
		)
),
HealthData AS (
	SELECT 
		hm.HealthMeasureKey,
		CASE
			WHEN benchmarkAreas.IsBenchmarkArea = 1 THEN NTILE(5) OVER(
				PARTITION BY benchmarkAreas.IsBenchmarkArea,
				fromDate.Date,
				toDate.Date
				ORDER BY Value
			)
			ELSE NULL
		END AS Quintile,
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
		COUNT,
		Value,
		LowerCi,
		UpperCi,
		hm.Year,
		fromDate.Date AS FromDate,
		toDate.Date AS ToDate,
		reportingPeriod.Period AS ReportingPeriod
	FROM
		dbo.HealthMeasure AS hm
		JOIN RequestedIndicator AS ind ON hm.IndicatorKey = ind.IndicatorKey
		JOIN dbo.AreaDimension AS areaDim ON hm.AreaKey = areaDim.AreaKey
		JOIN AreasWithIsBenchmarkAreaFlag AS benchmarkAreas ON areaDim.Code = benchmarkAreas.AreaCode
		JOIN dbo.SexDimension AS sex ON hm.SexKey = sex.SexKey
		JOIN dbo.AgeDimension AS ageDim ON hm.AgeKey = ageDim.AgeKey
		JOIN dbo.DeprivationDimension AS imd ON hm.DeprivationKey = imd.DeprivationKey
		JOIN dbo.TrendDimension AS trendDim ON hm.TrendKey = trendDim.TrendKey
		JOIN dbo.DateDimension AS fromDate ON hm.FromDateKey = fromDate.DateKey
		JOIN dbo.DateDimension AS toDate ON hm.ToDateKey = toDate.DateKey
		JOIN dbo.PeriodDimension AS reportingPeriod ON hm.PeriodKey = reportingPeriod.PeriodKey
	WHERE (
			--- This ensures we are only dealing with Aggregate data
			hm.IsSexAggregatedOrSingle = 1
			AND hm.IsAgeAggregatedOrSingle = 1
			AND hm.IsDeprivationAggregatedOrSingle = 1
		)
		AND (
			hm.Year IN (
				SELECT
					YearNum
				FROM
					@RequestedYears
			)
			OR NOT EXISTS (
				SELECT
					1
				FROM
					@RequestedYears
			)
		)
		AND (
			@RequestedFromDate IS NULL
			OR fromDate.Date >= @RequestedFromDate
		)
		AND (
			@RequestedToDate IS NULL
			OR toDate.Date <= @RequestedToDate
		)
		AND hm.PublishedAt <= @DateBefore
),
HealthDataNTileGroupCount AS (
	SELECT
		ToDate,
		FromDate,
		COUNT(*) AS COUNT
	FROM
		HealthData AS hd
	GROUP BY
		ToDate,
		FromDate
) --- The final select now filters based on the requested areas and calculates the Benchmark outcome
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
	hd.FromDate,
	hd.ToDate,
	ind.PeriodType,
	ind.CollectionFrequency,
	hd.ReportingPeriod,
	ind.Polarity AS BenchmarkComparisonIndicatorPolarity,
	ind.Name AS IndicatorDimensionName,
	bag.Code AS BenchmarkComparisonAreaCode,
	bag.Name AS BenchmarkComparisonAreaName,
	CASE
		WHEN nc.Count < 5 THEN 'NOT COMPARED'
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
		AND hd.Quintile = 2 THEN 'LOW'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 3 THEN 'MIDDLE'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 4 THEN 'HIGH'
		WHEN ind.Polarity = 'No judgement'
		AND hd.Quintile = 5 THEN 'HIGHEST'
	END AS BenchmarkComparisonOutcome
FROM
	HealthData AS hd
	JOIN @RequestedAreas AS areas ON hd.AreaDimensionCode = areas.AreaCode
	JOIN HealthDataNTileGroupCount AS nc ON hd.FromDate = nc.FromDate
	AND hd.ToDate = nc.ToDate
	CROSS JOIN RequestedIndicator ind
	CROSS JOIN BenchmarkAreaGroup bag
ORDER BY
	AreaDimensionName,
	hd.ToDate DESC,
	hd.FromDate DESC
END