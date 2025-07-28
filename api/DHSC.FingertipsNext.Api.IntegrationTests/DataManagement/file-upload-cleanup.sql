DELETE HealthMeasure
FROM dbo.HealthMeasure hm
         INNER JOIN DataManagement.Batch b ON hm.BatchId = b.batchId
WHERE b.OriginalFileName = 'file-upload-integration-test.csv'

DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'file-upload-integration-test.csv'
