CREATE TABLE Areas.AreaTypes (
    [AreaTypeKey] [int] IDENTITY(1, 1) NOT NULL, --the surrogate key
    [AreaTypeName] nvarchar(255) NOT NULL,
    [AreaTypeUrlName] nvarchar(50) NOT NULL,
    [HierarchyType] nvarchar(50) NOT NULL,
    [Level] int NOT NULL
)
GO 
CREATE UNIQUE INDEX idx_areatypes ON Areas.AreaTypes ([AreaTypeKey]);