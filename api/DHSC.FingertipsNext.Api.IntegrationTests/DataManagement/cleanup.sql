-- Remove Batch details for indicator 9000
DELETE
FROM DataManagement.Batch
WHERE IndicatorId = 9000
  AND OriginalFileName = 'valid.csv'

DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'integration-test.csv'
