-- Delete all HealthMeasure records inserted by setup.sql for integration testing

DELETE hm
FROM [dbo].[HealthMeasure] hm
INNER JOIN [dbo].[AreaDimension] ad ON hm.AreaKey = ad.AreaKey
INNER JOIN [dbo].[IndicatorDimension] idim ON hm.IndicatorKey = idim.IndicatorKey
INNER JOIN [dbo].[SexDimension] sd ON hm.SexKey = sd.SexKey
INNER JOIN [dbo].[AgeDimension] agedim ON hm.AgeKey = agedim.AgeKey
WHERE
    ad.Code = 'E12000002'
    AND idim.IndicatorId = 41101
    AND sd.Name = 'Male'
    AND agedim.AgeID = 1
    AND hm.BatchId IN ('unpublishedBatch1', 'publishedBatch1');