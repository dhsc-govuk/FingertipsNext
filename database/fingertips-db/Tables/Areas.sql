create table Areas.Areas(
    [Node] hierarchyid primary key clustered not null,
    [AreaCode] nvarchar(20) not null,
    [AreaName] nvarchar(255) not null,  
    [AreaTypeKey] nvarchar(50) not null
)

GO

create unique index idx_areas
on Areas.Areas ([AreaCode]);

GO

ALTER TABLE [Areas].[Areas]  WITH CHECK ADD  CONSTRAINT [FK_AreaTypes_AreaTypeKey] FOREIGN KEY([AreaTypeKey])
REFERENCES [Areas].[AreaTypes] ([AreaTypeKey])
GO
