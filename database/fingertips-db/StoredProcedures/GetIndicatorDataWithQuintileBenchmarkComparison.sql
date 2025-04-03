USE [fingertips-db]
GO
/****** Object:  StoredProcedure [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison]    Script Date: 02/04/2025 16:20:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- This stored procedure Gets HealthData and performs Quintile calculations
ALTER PROCEDURE [dbo].[GetIndicatorDetailsWithQuintileBenchmarkComparison]
-- The Areas we want data for
@RequestedAreas AreaCodeList READONLY,
-- The AreaType we are comparing against - this needs to be passed in because the AreaCodes can be ambiguous for districts and counties
@RequestedAreaType VARCHAR(50),
-- The Years we are interested in - can be empty
@RequestedYears YearList READONLY,
-- The specific indicatorId we are interested in
@RequestedIndicatorId INT,

@ExcludeDisaggregatedSexValues BIT,
@ExcludeDisaggregatedAgeValues BIT,
@ExcludeDisaggregatedDeprivationValues BIT

AS
BEGIN
	--If the indicator uses quintiles for benchmarking use different handling
	IF EXISTS (SELECT 1 FROM [IndicatorDimension] WHERE [IndicatorId] = @RequestedIndicatorId AND [BenchmarkComparisonMethod]= 'Quintiles')  
	BEGIN

		-- If the indicator has a quintiles benchmark comparison method we want to calculate that
		WITH
		-- Finds the indicator of interest from the passed in IndicatorId.
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
		-- This finds ALL data points in England of the same areaType which are aggregated (not inequalities) data points
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
				-- This ensures we are only dealing with Aggregate data
				hm.IsSexAggregatedOrSingle=1 AND hm.IsAgeAggregatedOrSingle=1 AND hm.IsDeprivationAggregatedOrSingle=1
			)
			AND
			(
				areaDim.AreaType = @RequestedAreaType
				-- This is special case handling for data which has a dual identity as both district and county.
				OR
				(
				   @RequestedAreaType = 'districts-and-unitary-authorities'
				   AND
				   IsDistrictAndCounty = 1
				)
			)
			AND
			(
				hm.Year IN (SELECT YearNum FROM @RequestedYears)
				-- If no years are passed in then return data for ALL years
				OR NOT EXISTS (SELECT 1 FROM @RequestedYears)
			)
		)
		-- The final select now filters based on the requested areas and calculates the Benchmark outcome
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
				WHEN ind.Polarity = 'High is good' THEN
					CASE 
						WHEN hd.Quintile = 1 THEN 'WORST'
						WHEN hd.Quintile = 2 THEN 'WORSE'
						WHEN hd.Quintile = 3 THEN 'MIDDLE'
						WHEN hd.Quintile = 4 THEN 'BETTER'
						WHEN hd.Quintile = 5 THEN 'BEST'
					END
				WHEN ind.Polarity = 'Low is good' THEN
					CASE
						WHEN hd.Quintile = 1 THEN 'BEST'
						WHEN hd.Quintile = 2 THEN 'BETTER'
						WHEN hd.Quintile = 3 THEN 'MIDDLE'
						WHEN hd.Quintile = 4 THEN 'WORSE'
						WHEN hd.Quintile = 5 THEN 'WORST'
					END
				WHEN ind.Polarity = 'No judgement' THEN
					CASE
						WHEN hd.Quintile = 1 THEN 'LOWEST'
						WHEN hd.Quintile = 2 THEN 'LOWER'
						WHEN hd.Quintile = 3 THEN 'SIMILAR'
						WHEN hd.Quintile = 4 THEN 'HIGHER'
						WHEN hd.Quintile = 5 THEN 'HIGHEST'
					END
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
	--If the indicator does not have quintiles as the benchmarking method use this
	ELSE
	BEGIN
		SELECT 
			hm.[Year],
			hm.[Value],
			hm.[Count],
			hm.[LowerCi],
			hm.[UpperCi],
			age.[Name],
			sex.[Name],
			ind.[Name],
			area.[Code],
			area.[Name],
			trend.[Name],
			[d].[Name],
			[d].[Type],
			[d].[Sequence],
			[d].[HasValue],
			CASE
				WHEN 
					hm.[IsAgeAggregatedOrSingle] = 1 
				AND 
					hm.[IsSexAggregatedOrSingle] = 1
				AND
					hm.[IsDeprivationAggregatedOrSingle] = 1
			THEN 
				CAST(1 AS bit)
			ELSE 
				CAST(0 AS bit)
			END [IsAggregate]
		FROM 
			[HealthMeasure] hm
		JOIN 
			[IndicatorDimension] AS ind ON hm.[IndicatorKey] = ind.[IndicatorKey]
		JOIN
			[AreaDimension] area ON hm.[AreaKey] = area.[AreaKey]
		JOIN
			[AgeDimension] age ON hm.[AgeKey] = age.[AgeKey]
		JOIN
			[SexDimension] sex ON hm.[SexKey] = sex.[SexKey]
		JOIN
			[TrendDimension] trend ON hm.[TrendKey] = trend.[TrendKey]
		JOIN
			[DeprivationDimension] AS [d] ON hm.[DeprivationKey] = [d].[DeprivationKey]
		WHERE 
			ind.[IndicatorId] = @RequestedIndicatorId
		AND
		(
			hm.Year IN (SELECT YearNum FROM @RequestedYears)
			OR NOT EXISTS --- If no years are passed in then return data for ALL years
			(SELECT 1 FROM @RequestedYears)
		)
		AND
		(
			area.Code IN (SELECT AreaCode FROM @RequestedAreas)
			OR NOT EXISTS --- If no areas are passed in then return data for ALL areas
			(SELECT 1 FROM @RequestedAreas)
		)
		AND (@ExcludeDisaggregatedSexValues = 0 OR hm.[IsSexAggregatedOrSingle] = 1)
		AND (@ExcludeDisaggregatedAgeValues = 0 OR hm.[IsAgeAggregatedOrSingle] = 1)
		AND (@ExcludeDisaggregatedDeprivationValues = 0 OR hm.[IsDeprivationAggregatedOrSingle] = 1)
		
		ORDER BY 
			hm.[Year]
	END
END