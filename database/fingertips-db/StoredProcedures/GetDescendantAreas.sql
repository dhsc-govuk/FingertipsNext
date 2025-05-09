--- This stored procedure Gets Descendant Areas for a given AreaType and Ancestor AreaCode
CREATE PROCEDURE [Areas].[GetDescendantAreas] 
@RequestedAreaType varchar(50),
@RequestedAncestorAreaCode varchar(20) 
AS 
    BEGIN 
        WITH 
            StartingArea AS (
                SELECT 
                    *
                FROM 
                    Areas.Areas area
                WHERE 
                    area.AreaCode = @RequestedAncestorAreaCode
                AND 
                    area.AreaTypeKey <> @RequestedAreaType
            ),
            TargetAreaType AS (
                SELECT 
                    *
                FROM 
                    Areas.AreaTypes AT
                WHERE 
                    --- this is the taget areaType
                    at.AreaTypeKey = @RequestedAreaType
            ),
        recursive_cte(
            AreaKey,
            AreaCode,
            AreaName,
            AreaTypeKey,
            AreaLevel,
            ParentAreaKey
        ) AS (
            SELECT 
                ar.ChildAreaKey AS AreaKey,
                a.AreaCode,
                a.AreaName,
                a.AreaTypeKey,
                at2.[LEVEL] AS AreaLevel,
                ar.ParentAreaKey
            FROM 
                Areas.AreaRelationships ar
            JOIN 
                Areas.Areas a 
            ON 
                a.AreaKey = ar.ChildAreaKey
            JOIN 
                StartingArea sa 
            ON 
                ar.ParentAreaKey = sa.AreaKey
            JOIN 
                Areas.AreaTypes at2 
            ON 
                at2.AreaTypeKey = a.AreaTypeKey
            UNION ALL
            SELECT 
                ar.ChildAreaKey AS AreaKey,
                a.AreaCode,
                a.AreaName,
                a.AreaTypeKey,
                at2.[LEVEL] AS AreaLevel,
                ar.ParentAreaKey
            FROM 
                Areas.AreaRelationships ar
            JOIN 
                Areas.Areas a 
            ON 
                a.AreaKey = ar.ChildAreaKey
            JOIN 
                Areas.AreaTypes at2 
            ON 
                at2.AreaTypeKey = a.AreaTypeKey
            INNER JOIN 
                recursive_cte 
            ON 
                recursive_cte.AreaKey = ar.ParentAreaKey
            CROSS JOIN 
                TargetAreaType tat
            WHERE 
                at2.[LEVEL] <= tat.[LEVEL]
            AND 
                at2.HierarchyType = tat.HierarchyType
        )
        SELECT DISTINCT 
            AreaKey,
            AreaCode,
            AreaName,
            tat.AreaTypeKey AS AreaTypeKey,
            tat.Level AS LEVEL,
            tat.HierarchyType AS HierarchyType,
            tat.AreaTypeName AS AreaTypeName
        FROM 
            recursive_cte rc
        JOIN 
            TargetAreaType tat 
        ON 
            rc.AreaTypeKey = tat.AreaTypeKey
END 