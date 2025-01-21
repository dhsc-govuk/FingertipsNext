using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepository : IAreaRepository
{
    private readonly AreaRepositoryDbContext _dbContext;

    public AreaRepository(AreaRepositoryDbContext dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }

    public async Task<string[]> GetHierarchiesAsync()
    {
        // TODO: check result when no hierarchies

        var hierarchies = await _dbContext.Hierarchies.
            FromSql($"""
                     SELECT
                         distinct HierarchyType
                     FROM
                         [Areas].[Areas]
                     ORDER BY HierarchyType
                     """)
            .ToArrayAsync();

        return hierarchies.Select(h => h.HierarchyType).ToArray();
    }

    public async Task<string[]> GetAreaTypesAsync(string? hierarchyType)
    {
        // TODO: check result when no types
        // TODO: support no hierarchyType

        var areaTypes = await _dbContext.AreaTypes.
            FromSqlInterpolated($"""
                      SELECT
                          distinct AreaType
                      FROM
                          [Areas].[Areas]
                      WHERE
                          HierarchyType = {hierarchyType}
                      ORDER BY AreaType
                      """
                )
            .ToArrayAsync();

        return areaTypes.Select(atm => atm.AreaType).ToArray();
    }

    public async Task<AreaWithRelationsModel?> GetAreaAsync(string areaCode, bool includeChildren, bool includeAncestors, string? childAreaType)
    {
        var area = await _dbContext.Area.
            FromSqlInterpolated($"SELECT * from [Areas].[Areas] where AreaCode={areaCode}")
            .FirstOrDefaultAsync();

        if (area == null)
            return null;

        var aresWithRelations = new AreaWithRelationsModel
        {
            Area = area
        };

        // TODO: these query returns data based on level not areaType
        // TODO: ancestors not tailored and tested for ancestors

        if (includeChildren)
        {
            // TODO: test against DB
            // TODO: how to handle areatype null
            // TODO: ia empty areatype same as null
            var children = await _dbContext.Area.
                FromSqlInterpolated($"""
                    --given an areacode return the children that are of a defined area type

                    DECLARE @areacode nvarchar(50)
                    SET @areacode={areaCode}

                    DECLARE @areatype nvarchar(50)
                    SET @areatype={childAreaType}

                    --get the level of the parent
                    DECLARE @parentlevel smallint =(SELECT [Level] FROM areas.areas WHERE AreaCode=@areacode)
                    DECLARE @myarea hierarchyid = (SELECT Node FROM areas.areas WHERE AreaCode = @areacode )

                    --GET the level of the areatype we are looking for
                    DECLARE @level smallint =(SELECT top 1 [Level] FROM areas.areas WHERE AreaType=@areatype)

                    --use the get ancestor functor with a variable level based on the difference between the things we are looking for and the group
                    SELECT
                        Node,
                        [Level],
                        AreaCode,
                        AreaName,
                        AreaType
                    FROM
                        [Areas].[Areas]
                    WHERE
                        Node.GetAncestor(@level - @parentlevel) = @myarea

                    """)
                    .ToListAsync();
        }

        if (includeAncestors)
        {
            var ancestors = await _dbContext.Area.
                FromSqlInterpolated($"""
                    --given an areacode return the children that are of a defined area type
                                    
                    DECLARE @areacode nvarchar(50)
                    SET @areacode={areaCode}
                    
                    DECLARE @areatype nvarchar(50)
                    SET @areatype='ICB'
                    
                    --get the level of the parent
                    DECLARE @parentlevel smallint =(SELECT [Level] FROM [Areas].[Areas] WHERE AreaCode=@areacode)
                    DECLARE @myarea hierarchyid = (SELECT Node FROM [Areas].[Areas] WHERE AreaCode = @areacode )
                    
                    --GET the level of the areatype we are looking for
                    DECLARE @level smallint =(SELECT top 1 [Level] FROM [Areas].[Areas] WHERE AreaType=@areatype)
                    
                    --use the get ancestor functor with a variable level based on the difference between the things we are looking for and the group
                    SELECT
                        *
                    FROM
                        [Areas].[Areas]
                    WHERE
                        Node.GetAncestor(@level - @parentlevel) = @myarea
                    """)
                    .ToListAsync();
        }

        return aresWithRelations;
    }

    public async Task<AreaModel?> GetRootAreaAsync()
    {
        var rootArea = await _dbContext.RootArea
            .FromSql($"SELECT * FROM [Areas].[Areas] WHERE Node = HIERARCHYID::GetRoot()")
            .FirstOrDefaultAsync();

        return rootArea;
    }
}