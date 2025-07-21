-- Remove Batch details for integration test upload
DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'integration-test.csv'

DELETE
FROM dbo.HealthMeasure
WHERE BatchId = '12345_2017-06-30T14:22:37.123'
