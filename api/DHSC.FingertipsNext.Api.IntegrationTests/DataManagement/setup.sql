INSERT INTO DataManagement.Batch
( BatchId
, IndicatorId
, CreatedAt
, PublishedAt
, UserId
, Status
, OriginalFilename)
VALUES ('41101_2020-03-07T14:22:37.123', 41101, '2017-06-30T18:49:37.000Z', '2025-08-09T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Received', 'integration-test.csv'),
       ('383_2017-06-30T14:22:37.123', 383, '2017-06-30T18:49:37.000Z', '2025-09-09T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Deleted', 'integration-test.csv'),
       ('22401_2017-06-30T14:22:37.123', 22401, '2017-06-30T18:49:37.000Z', '2025-10-09T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Received', 'integration-test.csv'),
       ('12345_2017-06-30T14:22:37.123', 12345, '2017-06-30T18:49:37.000Z', '2125-10-09T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Received', 'integration-test.csv'),
       ('54321_2017-06-30T14:22:37.123', 54321, '2017-06-30T18:49:37.000Z', '2025-01-01T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Received', 'integration-test.csv');

INSERT INTO DataManagement.Batch
( BatchId
, IndicatorId
, CreatedAt
, PublishedAt
, UserId
, Status
, OriginalFilename
, DeletedAt)
VALUES ('54321_2025-06-30T14:22:37.123', 54321, '2025-06-30T00:00:00.000Z', '2030-01-01T00:00:00.000Z',
        '4fbbbb61-ed6d-4777-943c-7d597f90445a', 'Deleted', 'integration-test.csv', '2025-07-01T00:00:00.000Z');

INSERT INTO [dbo].[HealthMeasure]
(AreaKey,
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
 BatchId)
SELECT (SELECT TOP 1 AreaKey FROM [dbo].[AreaDimension]
WHERE Code = 'E12000002')
    , (
SELECT TOP 1 IndicatorKey
FROM [dbo].[IndicatorDimension]
WHERE IndicatorId = 41101)
    , (
SELECT TOP 1 SexKey
FROM [dbo].[SexDimension]
WHERE Name = 'Male')
    , (
SELECT TOP 1 AgeKey
FROM [dbo].[AgeDimension]
WHERE AgeID = 1)
    , (
SELECT TOP 1 DeprivationKey
FROM [dbo].[DeprivationDimension]), 100, 200, 50.0, 45.0, 55.0, 2025, 1, 1, 1, (
SELECT TOP 1 DateKey
FROM [dbo].[DateDimension]), (
SELECT TOP 1 DateKey
FROM [dbo].[DateDimension]
ORDER BY DateKey DESC),
    (
SELECT TOP 1 PeriodKey
FROM [dbo].[PeriodDimension]), '2025-10-09T00:00:00.000Z', '12345_2017-06-30T14:22:37.123'