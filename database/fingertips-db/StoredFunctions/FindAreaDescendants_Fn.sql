/********************************************************************************************
-- Script Name:     FindAreaDescendants_Fn.sql
-- Description:     This script creates the table function [dbo].[FindAreaDescendants]
                    that finds descendant areas for a given AreaType and Ancestor AreaCode
                    using a recursive common table expression (CTE).

-- Parameters:
    @RequestedAreaType          : The AreaTypeKey of the descendant areas to find.
    @RequestedAncestorAreaCode  : The AreaCode of the ancestor area to start the search from.

-- Returns:
    A table of areas that are descendants of the specified ancestor and match the specified AreaType.

-- Usage:
    SELECT * FROM dbo.FindAreaDescendants('LocalAuthority', 'E09000001', 5);
*********************************************************************************************/


CREATE FUNCTION [dbo].[FindAreaDescendants_Fn]( 
    @RequestedAreaType VARCHAR(50),
    @RequestedAncestorAreaCode VARCHAR(20),
)
RETURNS TABLE
AS
RETURN (
    WITH 
    ParentAreaByCodeWithDifferentAreaType AS (
        SELECT *
        FROM Areas.Areas area
        WHERE area.AreaCode = @RequestedAncestorAreaCode
          AND area.AreaTypeKey <> @RequestedAreaType
    ),

    TargetAreaType AS (
        SELECT *
        FROM Areas.AreaTypes AT
        WHERE AT.AreaTypeKey = @RequestedAreaType
    ),

    AreaRelationshipsHierarchy_CTE (
        AreaKey,
        AreaCode,
        AreaName,
        AreaTypeKey,
        AreaLevel,
        ParentAreaKey,
        Depth
    ) AS (
        -- Anchor part of the recursive CTE
        SELECT 
            ar.ChildAreaKey AS AreaKey,
            a.AreaCode,
            a.AreaName,
            a.AreaTypeKey,
            at2.[Level] AS AreaLevel,
            ar.ParentAreaKey,
        FROM Areas.AreaRelationships ar
        JOIN Areas.Areas a ON a.AreaKey = ar.ChildAreaKey
        JOIN ParentAreaByCodeWithDifferentAreaType sa ON ar.ParentAreaKey = sa.AreaKey
        JOIN Areas.AreaTypes at2 ON at2.AreaTypeKey = a.AreaTypeKey

        UNION ALL

        -- Recursive step to find descendants
        SELECT 
            ar.ChildAreaKey AS AreaKey,
            a.AreaCode,
            a.AreaName,
            a.AreaTypeKey,
            at2.[Level] AS AreaLevel,
            ar.ParentAreaKey
        FROM Areas.AreaRelationships ar
        JOIN Areas.Areas a ON a.AreaKey = ar.ChildAreaKey
        JOIN Areas.AreaTypes at2 ON at2.AreaTypeKey = a.AreaTypeKey
        INNER JOIN AreaRelationshipsHierarchy_CTE recursive_cte ON recursive_cte.AreaKey = ar.ParentAreaKey
        CROSS JOIN TargetAreaType tat
        WHERE at2.[Level] <= tat.[Level]
          AND at2.HierarchyType = tat.HierarchyType
    )

    -- Final result selection
    SELECT DISTINCT 
        rc.AreaKey,
        rc.AreaCode,
        rc.AreaName,
        tat.AreaTypeKey,
        tat.[Level] AS Level,
        tat.HierarchyType,
        tat.AreaTypeName
    FROM AreaRelationshipsHierarchy_CTE rc
    JOIN TargetAreaType tat ON rc.AreaTypeKey = tat.AreaTypeKey
);
