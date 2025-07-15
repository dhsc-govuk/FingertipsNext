-- Table linking Entra Group IDs (the role) with indicator dimensions to apply RBAC.
CREATE TABLE [User].[IndicatorRole]
(
    [Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [RoleId] UNIQUEIDENTIFIER NOT NULL,  -- The GUID of the entra role ID
    [IndicatorKey] SMALLINT NOT NULL,  -- ID of the indicator dimension
);
GO;