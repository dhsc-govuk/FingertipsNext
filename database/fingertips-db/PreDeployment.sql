/*
 Pre-Deployment Script Template							
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be executed before the build script.	
 Use SQLCMD syntax to include a file in the pre-deployment script.			
 Example:      :r .\myfile.sql								
 Use SQLCMD syntax to reference a variable in the pre-deployment script.		
 Example:      :setvar TableName MyTable							
               SELECT * FROM [$(TableName)]					
--------------------------------------------------------------------------------------
*/
TRUNCATE TABLE [dbo].[HealthMeasure]
DELETE FROM [dbo].[AgeDimension]
DELETE FROM [dbo].[AreaDimension]
DELETE FROM [dbo].[DeprivationDimension]
DELETE FROM  [dbo].[IndicatorDimension]
DELETE FROM [dbo].[SexDimension]
DELETE FROM [dbo].[TrendDimension]
DELETE FROM [Areas].[AreaRelationships]
DELETE FROM [Areas].[Areas]
DELETE FROM [Areas].[AreaTypes];

--reseed the tables, starting from 0. Currently identity insert is turned off for this seeding data
DBCC CHECKIDENT ('[HealthMeasure]', RESEED, 0);
DBCC CHECKIDENT ('[AgeDimension]', RESEED, 0);
DBCC CHECKIDENT ('[AreaDimension]', RESEED, 0);
DBCC CHECKIDENT ('[DeprivationDimension]', RESEED, 0);
DBCC CHECKIDENT ('[IndicatorDimension]', RESEED, 0);
DBCC CHECKIDENT ('[SexDimension]', RESEED, 0);
DBCC CHECKIDENT ('[TrendDimension]', RESEED, 0);
DBCC CHECKIDENT ('[Areas].[Areas]', RESEED, 0);