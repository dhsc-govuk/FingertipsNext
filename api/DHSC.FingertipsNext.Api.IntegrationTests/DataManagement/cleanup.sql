-- Remove Batch details for integration test upload
DELETE
FROM DataManagement.Batch
WHERE OriginalFileName = 'integration-test.csv'
