-- This script identifies duplicate health measures in the database.
-- It groups the health measures by various dimensions and counts the duplicates.
WITH 
  groupedHealthMeasures AS (
SELECT
	count(*) as DuplicateCount,
	id.IndicatorId,
	ad.Code,
	hm.Year,
	ad2.Name as ageName,
	sd.Name as sexName,
	dd.Name as imdName
FROM
	dbo.HealthMeasure hm
JOIN 
	dbo.AreaDimension ad 
ON
	ad.AreaKey = hm.AreaKey
JOIN
	dbo.IndicatorDimension id 
ON
	id.IndicatorKey = hm.IndicatorKey
JOIN 
	dbo.SexDimension sd 
ON
	sd.SexKey = hm.SexKey
JOIN
	dbo.AgeDimension ad2 
ON
	ad2.AgeKey = hm.AgeKey
JOIN
	dbo.DeprivationDimension dd 
ON
	dd.DeprivationKey = hm.DeprivationKey
GROUP BY 
	id.IndicatorId ,
	ad.Code,
	hm.[Year],
	ad2.AgeKey,
	ad2.Name,
	sd.Name,
	dd.DeprivationKey,
	dd.Name
	)
SELECT
	*
FROM
	groupedHealthMeasures
WHERE
	DuplicateCount > 1