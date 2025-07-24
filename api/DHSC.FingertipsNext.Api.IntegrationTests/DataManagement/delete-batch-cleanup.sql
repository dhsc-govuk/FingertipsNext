DELETE HealthMeasure
FROM dbo.HealthMeasure hm
         INNER JOIN DataManagement.Batch b ON hm.BatchId = b.batchId
WHERE b.OriginalFileName = 'delete-batch-integration-test.csv'

DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'delete-batch-integration-test.csv'
