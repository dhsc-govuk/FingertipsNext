-- Comment
CREATE TABLE [User].[IndicatorRole]
(
    [Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [RoleId] UNIQUEIDENTIFIER NOT NULL,  -- The GUID of the entra role ID
    [IndicatorKey] SMALLINT NOT NULL,  -- ID of the indicator dimension
);
GO;

-- Add the foreign key constraint to the IndicatorRole table
ALTER TABLE [User].[IndicatorRole] WITH CHECK 
ADD CONSTRAINT [FK_IndicatorRole_IndicatorDimension] 
FOREIGN KEY ([IndicatorKey])
REFERENCES [dbo].[IndicatorDimension] ([IndicatorKey]);
GO;

-- Enable the foreign key constraint
ALTER TABLE [User].[IndicatorRole] CHECK CONSTRAINT [FK_IndicatorRole_IndicatorDimension];