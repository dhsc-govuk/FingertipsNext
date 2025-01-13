create table Areas.Areas  
([Node] hierarchyid primary key clustered not null,
[Level] int not null,
[AreaCode] nvarchar(20) not null,
[AreaName] nvarchar(255) not null,  
[AreaType] nvarchar(50) not null,
[HierarchyType] nvarchar(50) not null)

GO

create unique index idx_areas
on Areas.Areas ([Level], [Node]);
