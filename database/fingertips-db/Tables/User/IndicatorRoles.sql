-- Comment
CREATE TABLE [User].[IndicatorRoles]
(
    [Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,  -- 
    [RoleId] UNIQUEIDENTIFIER NOT NULL,  -- The GUID of the entra role ID
    [IndicatorKey] SMALLINT NOT NULL,  -- ID of the indicator dimension
);
GO;

-- Add the foreign key constraint to the IndicatorDimension table
ALTER TABLE [User].[IndicatorRoles] WITH CHECK 
ADD CONSTRAINT [FK_IndicatorRoles_IndicatorDimension] 
FOREIGN KEY ([IndicatorKey])
REFERENCES [dbo].[IndicatorDimension] ([IndicatorKey]);
GO;

-- Enable the foreign key constraint
ALTER TABLE [User].[IndicatorRoles] CHECK CONSTRAINT [FK_IndicatorRoles_IndicatorDimension];