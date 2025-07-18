-- Remove Batch details for indicator 9000
DELETE FROM DataManagement.Batch
WHERE IndicatorId = 9000
  AND OriginalFileName = 'valid.csv'

DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'integration-test.csv'

DELETE
FROM dbo.HealthMeasure
WHERE BatchId = '12345_2017-06-30T14:22:37.123'
