create table Areas.Areas(
    [AreaKey] int  IDENTITY(1,1) not null,
    [AreaCode] nvarchar(20) not null,
    [AreaName] nvarchar(255) not null,  
    [AreaTypeKey] nvarchar(50) not null
)

GO

ALTER TABLE [Areas].[Areas]  
ADD CONSTRAINT idx_areakey UNIQUE (AreaKey);   
GO  

ALTER TABLE [Areas].[Areas]  WITH CHECK ADD  CONSTRAINT [FK_AreaTypes_AreaTypeKey] FOREIGN KEY([AreaTypeKey])
REFERENCES [Areas].[AreaTypes] ([AreaTypeKey])

GO
