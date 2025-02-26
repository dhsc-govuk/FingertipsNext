SET NOCOUNT ON;
GO

-- External data source creation (only if using Azure Blob)
IF '$(UseAzureBlob)' = '1'
BEGIN
    IF NOT EXISTS (SELECT * FROM sys.symmetric_keys WHERE name = '##MS_DatabaseMasterKey##')
        EXEC('CREATE MASTER KEY ENCRYPTION BY PASSWORD = ''$(MasterKeyPassword)''');
    IF NOT EXISTS (SELECT * FROM sys.database_scoped_credentials WHERE name = 'MyAzureBlobStorageCredential')
        EXEC('CREATE DATABASE SCOPED CREDENTIAL MyAzureBlobStorageCredential WITH IDENTITY = ''Managed Identity''');
    IF NOT EXISTS (SELECT * FROM sys.external_data_sources WHERE name = 'MyAzureBlobStorage')
        EXEC('CREATE EXTERNAL DATA SOURCE MyAzureBlobStorage WITH (TYPE = BLOB_STORAGE, LOCATION = ''$(BlobStorageLocation)'', CREDENTIAL = MyAzureBlobStorageCredential)');
END;
GO

TRUNCATE TABLE [dbo].[HealthMeasure];
GO
DELETE FROM [dbo].[AgeDimension];
GO
DELETE FROM [dbo].[AreaDimension];
GO
DELETE FROM [dbo].[IndicatorDimension];
GO
DELETE FROM [dbo].[SexDimension];
GO

DBCC CHECKIDENT ('[HealthMeasure]', RESEED, 0);
DBCC CHECKIDENT ('[AgeDimension]', RESEED, 0);
DBCC CHECKIDENT ('[AreaDimension]', RESEED, 0);
DBCC CHECKIDENT ('[IndicatorDimension]', RESEED, 0);
DBCC CHECKIDENT ('[SexDimension]', RESEED, 0);
GO

BEGIN TRY DROP TABLE #TempAgeData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempIndicatorData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempAreaData; END TRY BEGIN CATCH END CATCH;
GO
BEGIN TRY DROP TABLE #TempHealthData; END TRY BEGIN CATCH END CATCH;
GO

INSERT INTO [dbo].[SexDimension] (Name, IsFemale, HasValue)
VALUES ('Male', 0, 1), ('Female', 1, 1), ('Persons', 0, 0);
GO

/* Age Data */
CREATE TABLE #TempAgeData
(
    AgeID INT,
    Age NVARCHAR(255),
    MinYears INT,
    MaxYears INT
);
DECLARE @sqlAge NVARCHAR(4000), @filePathAge NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathAge = 'agedata.csv';
ELSE
    SET @filePathAge = '$(LocalFilePath)agedata.csv';
SET @sqlAge = 'BULK INSERT #TempAgeData FROM ''' + @filePathAge + ''' WITH (' +
              CASE WHEN '$(UseAzureBlob)' = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlAge;
GO

INSERT INTO [dbo].[AgeDimension] (Name, AgeID, HasValue)
SELECT RTRIM(Age), AgeID, IIF(AgeID = 1, 0, 1)
FROM #TempAgeData;
GO

DROP TABLE #TempAgeData;
GO

/* Indicator Data */
CREATE TABLE #TempIndicatorData
(
    IndicatorID INT,
    IndicatorName NVARCHAR(255)
);
DECLARE @sqlInd NVARCHAR(4000), @filePathInd NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathInd = 'indicators.csv';
ELSE
    SET @filePathInd = '$(LocalFilePath)indicators.csv';
SET @sqlInd = 'BULK INSERT #TempIndicatorData FROM ''' + @filePathInd + ''' WITH (' +
              CASE WHEN '$(UseAzureBlob)' = '1'
                   THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                   ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
              END + ')';
EXEC sp_executesql @sqlInd;
GO

INSERT INTO [dbo].[IndicatorDimension] (Name, IndicatorId, StartDate, EndDate)
SELECT TRIM('"' FROM IndicatorName), IndicatorID, DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempIndicatorData;
GO

DROP TABLE #TempIndicatorData;
GO

/* Area Data */
CREATE TABLE #TempAreaData
(
    Children NVARCHAR(MAX),
    Parents NVARCHAR(MAX),
    AreaCode NVARCHAR(255),
    AreaName NVARCHAR(255)
);
DECLARE @sqlArea NVARCHAR(4000), @filePathArea NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathArea = 'areas.csv';
ELSE
    SET @filePathArea = '$(LocalFilePath)areas.csv';
SET @sqlArea = 'BULK INSERT #TempAreaData FROM ''' + @filePathArea + ''' WITH (' +
               CASE WHEN '$(UseAzureBlob)' = '1'
                    THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                    ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
               END + ')';
EXEC sp_executesql @sqlArea;
GO

INSERT INTO dbo.AreaDimension (Code, Name, StartDate, EndDate)
SELECT RTRIM(AreaCode), RTRIM(AreaName), DATEADD(YEAR, -10, GETDATE()), DATEADD(YEAR, 10, GETDATE())
FROM #TempAreaData;
GO

DROP TABLE #TempAreaData;
GO

/* Health Data */
CREATE TABLE #TempHealthData
(
    IndicatorId INT,
    Year INT,
    AgeID INT,
    Sex NVARCHAR(255),
    AreaCode NVARCHAR(255),
    Count FLOAT,
    Value FLOAT,
    LowerCI FLOAT,
    UpperCI FLOAT,
    Denominator FLOAT,
    Trend NVARCHAR(255),
    CategoryTypeId INT,
    CategoryId INT
);
DECLARE @sqlHealth NVARCHAR(4000), @filePathHealth NVARCHAR(500);
IF '$(UseAzureBlob)' = '1'
    SET @filePathHealth = 'healthdata.csv';
ELSE
    SET @filePathHealth = '$(LocalFilePath)healthdata.csv';
SET @sqlHealth = 'BULK INSERT #TempHealthData FROM ''' + @filePathHealth + ''' WITH (' +
                 CASE WHEN '$(UseAzureBlob)' = '1'
                      THEN 'DATA_SOURCE = ''MyAzureBlobStorage'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                      ELSE 'DATAFILETYPE = ''char'', FIELDTERMINATOR = '','', ROWTERMINATOR = ''\n'', FIRSTROW = 2'
                 END + ')';
EXEC sp_executesql @sqlHealth;
GO

INSERT INTO [dbo].[HealthMeasure] (AreaKey, IndicatorKey, SexKey, AgeKey, Count, Value, LowerCI, UpperCI, Year)
SELECT
    (SELECT TOP 1 [AreaKey] FROM [dbo].[AreaDimension] WHERE [Code] = LTRIM(RTRIM(temp.AreaCode))),
    (SELECT TOP 1 [IndicatorKey] FROM [dbo].[IndicatorDimension] WHERE IndicatorId = temp.IndicatorId),
    (SELECT TOP 1 [SexKey] FROM [dbo].[SexDimension] WHERE [Name] = LTRIM(RTRIM(temp.Sex))),
    (SELECT TOP 1 [AgeKey] FROM [dbo].[AgeDimension] WHERE [AgeID] = temp.AgeID),
    Count, Value, LowerCI, UpperCI, Year
FROM #TempHealthData temp
WHERE temp.Value IS NOT NULL;
GO

DROP TABLE #TempHealthData;
GO

DELETE FROM [Areas].[Areas];
DELETE FROM [Areas].[AreaTypes];
GO

INSERT [Areas].[AreaTypes] ([AreaTypeKey],[Level],[HierarchyType],[AreaTypeName])
VALUES 
('england', 1, 'All', 'England'),
('nhs-regions', 2, 'NHS', 'NHS Regions'),
('nhs-integrated-care-boards', 3, 'NHS', 'NHS Integrated Care Boards'),
('nhs-sub-integrated-care-boards', 4, 'NHS', 'NHS Sub Integrated Care Boards'),
('nhs-primary-care-networks', 5, 'NHS', 'NHS Primary Care Networks'),
('gps', 6, 'NHS', 'GPs'),
('regions', 2, 'Admin', 'Regions'),
('combined-authorities', 3, 'Admin', 'Combined Authorities'),
('counties-and-unitary-authorities', 4, 'Admin', 'Counties and Unitary Authorities'),
('districts-and-unitary-authorities', 5, 'Admin', 'Districts and Unitary Authorities');
GO

INSERT [Areas].[Areas]
VALUES
('/','E92000001','England','england'),
('/1/','E12000001','North East region (statistical)','regions'),
('/2/','E12000002','North West region (statistical)','regions'),
('/3/','E12000003','Yorkshire and the Humber region (statistical)','regions'),
('/4/','E40000007','East of England NHS Region','nhs-regions'),
('/5/','E40000003','London NHS Region','nhs-regions'),
('/6/','E40000005','South East NHS Region','nhs-regions'),
('/7/','E40000006','South West NHS Region','nhs-regions'),
('/8/','E40000010','North West NHS Region','nhs-regions'),
('/9/','E40000011','Midlands NHS Region','nhs-regions'),
('/10/','E40000012','North East and Yorkshire NHS Region','nhs-regions'),
('/1/1/','E06000047','County Durham','counties-and-unitary-authorities'),
('/1/2/','E06000005','Darlington','counties-and-unitary-authorities'),
('/1/3/','E08000037','Gateshead','counties-and-unitary-authorities'),
('/4/1/','E38000007','NHS Basildon And Brentwood ICB','nhs-integrated-care-boards'),
('/4/2/','E38000026','NHS Cambridgeshire and Peterborough ICB','nhs-integrated-care-boards'),
('/5/1/','E38000240','NHS North Central London ICB','nhs-integrated-care-boards'),
('/5/2/','E38000244','NHS South East London ICB','nhs-integrated-care-boards'),
('/4/1/1/','U15488','East Basildon PCN','nhs-primary-care-networks'),
('/4/1/2/','U55146','Central Basildon PCN','nhs-primary-care-networks'),
('/5/1/1/','U02795','North 2 Islington PCN','nhs-primary-care-networks'),
('/5/1/2/','U05885','South Camden PCN','nhs-primary-care-networks'),
('/4/1/1/1/','F81186','Felmores Medical Centre','gps'),
('/4/1/1/2/','F81640','Aryan Medical Centre','gps'),
('/5/1/1/1/','F83004','Archway Medical Centre','gps'),
('/5/1/1/2/','F83008','The Goodinge Group Practice','gps');
GO

PRINT N'Update complete.';
GO
