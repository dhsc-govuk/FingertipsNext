-- Insert three HealthMeasure records for integration testing

INSERT INTO [dbo].[HealthMeasure]
(
    AreaKey,
    IndicatorKey,
    SexKey,
    AgeKey,
    DeprivationKey,
    Count,
    Denominator,
    Value,
    LowerCI,
    UpperCI,
    Year,
    IsSexAggregatedOrSingle,
    IsAgeAggregatedOrSingle,
    IsDeprivationAggregatedOrSingle,
    FromDateKey,
    ToDateKey,
    PeriodKey,
    PublishedAt,
    BatchId
)
SELECT
    (SELECT TOP 1 AreaKey FROM [dbo].[AreaDimension] WHERE Code = 'E12000002'),
    (SELECT TOP 1 IndicatorKey FROM [dbo].[IndicatorDimension] WHERE IndicatorId = 41101),
    (SELECT TOP 1 SexKey FROM [dbo].[SexDimension] WHERE Name = 'Male'),
    (SELECT TOP 1 AgeKey FROM [dbo].[AgeDimension] WHERE AgeID = 1),
    (SELECT TOP 1 DeprivationKey FROM [dbo].[DeprivationDimension]),
    100, 
    200, 
    50.0,
    45.0,
    55.0,
    2025,
    1,   
    1,   
    1,   
                                                                                                                                                                                                                                                               -- FromDateKey: use a valid date key
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension]),
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension] ORDER BY DateKey DESC),
    (SELECT TOP 1 PeriodKey FROM [dbo].[PeriodDimension]),
    DATEADD(year, 1, GETUTCDATE()),
    'unpublishedBatch1'
UNION ALL
SELECT
    (SELECT TOP 1 AreaKey FROM [dbo].[AreaDimension] WHERE Code = 'E12000002'),
    (SELECT TOP 1 IndicatorKey FROM [dbo].[IndicatorDimension] WHERE IndicatorId = 41101),
    (SELECT TOP 1 SexKey FROM [dbo].[SexDimension] WHERE Name = 'Male'),
    (SELECT TOP 1 AgeKey FROM [dbo].[AgeDimension] WHERE AgeID = 1),
    (SELECT TOP 1 DeprivationKey FROM [dbo].[DeprivationDimension]),
    101, 201, 51.0, 46.0, 56.0, 2025, 1, 1, 1,
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension]),
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension] ORDER BY DateKey DESC),
    (SELECT TOP 1 PeriodKey FROM [dbo].[PeriodDimension]),
    DATEADD(year, 1, GETUTCDATE()),
    'unpublishedBatch1'
UNION ALL
SELECT
    (SELECT TOP 1 AreaKey FROM [dbo].[AreaDimension] WHERE Code = 'E12000002'),
    (SELECT TOP 1 IndicatorKey FROM [dbo].[IndicatorDimension] WHERE IndicatorId = 41101),
    (SELECT TOP 1 SexKey FROM [dbo].[SexDimension] WHERE Name = 'Male'),
    (SELECT TOP 1 AgeKey FROM [dbo].[AgeDimension] WHERE AgeID = 1),
    (SELECT TOP 1 DeprivationKey FROM [dbo].[DeprivationDimension]),
    102, 202, 52.0, 47.0, 57.0, 2025, 1, 1, 1,
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension]),
    (SELECT TOP 1 DateKey FROM [dbo].[DateDimension] ORDER BY DateKey DESC),
    (SELECT TOP 1 PeriodKey FROM [dbo].[PeriodDimension]),
    GETUTCDATE(),
    'publishedBatch1';