CREATE TABLE Areas.AreaTypes (
    [AreaTypeKey] nvarchar(50) primary key NOT NULL,
    [AreaTypeName] nvarchar(50) NOT NULL,
    [HierarchyType] nvarchar(50) NOT NULL,
    [Level] int NOT NULL
)
GO 
CREATE UNIQUE INDEX idx_areatypes ON Areas.AreaTypes ([AreaTypeName]);