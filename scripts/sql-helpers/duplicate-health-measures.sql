-- This script identifies duplicate health measures in the database.
-- It groups the health measures by various dimensions and counts the duplicates.
WITH 
  groupedHealthMeasures AS (
SELECT
    COUNT(*) AS DuplicateCount,
        id.IndicatorId,
        ad.Code,
        hm.Year,
        pd.Period,
        dtFrom.[Date] AS FromDate,
        dtTo.[Date] AS ToDate,
        ad2.Name AS ageName,
        sd.Name AS sexName,
        dd.Name AS imdName
    FROM dbo.HealthMeasure hm
             JOIN dbo.AreaDimension ad ON ad.AreaKey = hm.AreaKey
             JOIN dbo.IndicatorDimension id ON id.IndicatorKey = hm.IndicatorKey
             JOIN dbo.SexDimension sd ON sd.SexKey = hm.SexKey
             JOIN dbo.AgeDimension ad2 ON ad2.AgeKey = hm.AgeKey
             JOIN dbo.DeprivationDimension dd ON dd.DeprivationKey = hm.DeprivationKey
             JOIN dbo.PeriodDimension pd ON pd.PeriodKey = hm.PeriodKey
             JOIN dbo.DateDimension dtFrom ON dtFrom.DateKey = hm.FromDateKey
             JOIN dbo.DateDimension dtTo ON dtTo.DateKey = hm.ToDateKey
    GROUP BY
        id.IndicatorId,
        ad.Code,
        hm.Year,
        pd.Period,
        dtFrom.Date,
        dtTo.Date,
        ad2.AgeKey,
        ad2.Name,
        sd.Name,
        dd.DeprivationKey,
        dd.Name
)
SELECT DuplicateCount,
    IndicatorId,
    Code,
    Year,
    Period,
    FromDate,
    ToDate,
    ageName,
    sexName,
    imdName
FROM groupedHealthMeasures
WHERE DuplicateCount > 1
