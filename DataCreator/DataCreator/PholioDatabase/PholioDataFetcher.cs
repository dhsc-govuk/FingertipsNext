using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataCreator.PholioDatabase
{
    public class PholioDataFetcher
    {
        private readonly IConfiguration _config;
        private readonly List<GeographyMap> _map;
        private const string Region = "Region";
        private const string Administrative = "Administrative";
        private const string NHS = "NHS";
        private const string UA = "Unitary Authority";
        private const string NHSREGION = "NHS Region";
        private const string DISTRICT = "District";
        private const string GP = "GP";
        private const string AreaTypes = @"
    ('Combined authorities',
    'County unchanged',
    'England',
    'GPs',
    'ICB sub-locations',
    'ICBs',
    'LA new 2019',
    'LA unchanged',
    'NHS region',
    'NHS regions - new due to ICB changes',
    'PCNs (v. 26/04/24)',
    'Regions (statistical)',
    'UA new 2019',
    'UA new 2020',
    'UA new 2021',
    'UA new 2023',
    'UA unchanged')";

        private string AreaSql = @"
SELECT  
    area.[AreaCode]
    ,area.[AreaName]
    ,area.[AddressLine1]
    ,area.[AddressLine2]
    ,area.[AddressLine3]
    ,area.[AddressLine4]
    ,area.[Postcode],
    areatypes.AreaType
FROM 
    [PHOLIO_DEV].[dbo].[L_Areas] area
JOIN
    [dbo].[L_AreaTypes] areatypes
ON
    area.AreaTypeID = areatypes.AreaTypeID
WHERE
    area.iscurrent=1
AND
	areatypes.AreaType IN ";

        private const string AreaChildSql = @"
SELECT 
		[ChildLevelGeographyCode] ChildAreaCode,
		[ParentLevelGeographyCode] ParentAreaCode
	FROM
		[dbo].[L_AreaMapping]
"

;

        public PholioDataFetcher(IConfiguration config)
        {
            _config = config;
            _map =
            [
                new()
                {
                    OriginalAreaType="England",
                    NewAreaType="England",
                    HierarchyType="Both",
                    Level=0
                },
                new()
                {
                    OriginalAreaType="Regions (statistical)",
                    NewAreaType=Region,
                    HierarchyType=Administrative,
                    Level=1
                },
                new() {
                    OriginalAreaType="Combined authorities",
                    NewAreaType="Combined Authority",
                    HierarchyType=Administrative,
                    Level=2
                },
                new() {
                    OriginalAreaType="County unchanged",
                    NewAreaType="County",
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new() {
                    OriginalAreaType="LA new 2019",
                    NewAreaType=DISTRICT,
                    HierarchyType=Administrative,
                    Level=3
                }
                ,
                new() {
                    OriginalAreaType="LA unchanged",
                    NewAreaType=DISTRICT,
                    HierarchyType=Administrative,
                    Level=3
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2019",
                    NewAreaType=UA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2020",
                    NewAreaType=UA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2021",
                    NewAreaType=UA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2023",
                    NewAreaType=UA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA unchanged",
                    NewAreaType=UA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="NHS region",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS,
                    Level=1
                }
                ,
                new()
                {
                    OriginalAreaType="NHS regions - new due to ICB changes",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS,
                    Level=1
                }
                ,
                new()
                {
                    OriginalAreaType="PCNs (v. 26/04/24)",
                    NewAreaType="NHS Primary Care Network",
                    HierarchyType=NHS,
                    Level=4
                }
                ,
                new()
                {
                    OriginalAreaType="GPs",
                    NewAreaType=GP,
                    HierarchyType=NHS,
                    Level=5

                },
                new() {
                    OriginalAreaType="ICB sub-locations",
                    NewAreaType="NHS Sub Integrated Care Board",
                    HierarchyType=NHS,
                    Level=3
                },
                new() {
                    OriginalAreaType="ICBs",
                    NewAreaType="NHS Integrated Care Board",
                    HierarchyType=NHS,
                    Level=2
                }
            ];
        }

        public async Task<IEnumerable<AreaEntity>> FetchAreasAsync()
        {   
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var areas = await connection.QueryAsync<AreaEntity>($"{AreaSql}{AreaTypes}");
            var parentChildMap = await connection.QueryAsync<ParentChildAreaCode>(AreaChildSql);

            foreach (var area in areas)
            {
                //change the area type to a standard name and set the hierarchy type and level
                var match = _map.FirstOrDefault(a => a.OriginalAreaType == area.AreaType);
                if(match != null)
                {
                    area.AreaType = match.NewAreaType;
                    area.HierarchyType=match.HierarchyType;
                    area.Level = match.Level;
                }
            }

            //now create the child and parents
            var areasDict = areas.ToDictionary(area => area.AreaCode);
            foreach (var area in areas)
            {
                //get the children of the area (if any)
                area.ChildAreas = CreateChildAreas(area, parentChildMap, areasDict);

                //get the parents of the area (if any)
                area.ParentAreas = CreateParentAreas(area, parentChildMap, areasDict);
            }

            return areas;
        }

        private static List<AreaRelation> CreateChildAreas(AreaEntity area, IEnumerable<ParentChildAreaCode> parentChildMap, Dictionary<string,AreaEntity> areas)
        {
            var allChildren=parentChildMap
                    .Where(m => m.ParentAreaCode == area.AreaCode)
                    .Select(child => new AreaRelation { AreaCode = child.ChildAreaCode })
                    .ToList();
            //work out the direct children
            foreach (var child in allChildren)
            {
                var present = areas.TryGetValue(child.AreaCode, out AreaEntity value);
                if (present)
                    child.IsDirect = area.Level == value.Level - 1 && area.HierarchyType == value.HierarchyType;
            }
            
            return allChildren.Where(x => x.IsDirect).ToList();
        }

        private static List<AreaRelation> CreateParentAreas(AreaEntity area, IEnumerable<ParentChildAreaCode> parentChildMap, Dictionary<string, AreaEntity> areas)
        {
            var allParents = parentChildMap
                    .Where(m => m.ChildAreaCode == area.AreaCode)
                    .Select(child => new AreaRelation { AreaCode = child.ParentAreaCode })
                    .ToList();
            //work out the direct parents
            foreach (var parent in allParents)
            {
                var present = areas.TryGetValue(parent.AreaCode, out AreaEntity value);
                if (present)
                {
                    parent.IsDirect = area.Level == value.Level + 1 && area.HierarchyType == value.HierarchyType;
                    if (parent.IsDirect)
                    {
                        var b = 1;
                    }
                        
                }
            }
            //some GPs are not in a PCN
            if(area.AreaType==GP && allParents.All(parent => !parent.IsDirect))
            {
                foreach (var parent in allParents)
                {
                    var present = areas.TryGetValue(parent.AreaCode, out AreaEntity value);
                    if (present)
                    {
                        parent.IsDirect = area.Level == value.Level + 2 && area.HierarchyType == value.HierarchyType;
                        if (parent.IsDirect)
                        {
                            var b = 1;
                        }

                    }
                }
            }

            return allParents.Where(x => x.IsDirect).ToList();
        }

        public async Task<IEnumerable<AreaEntity>> FetchIndicatorsWithRelatedAreasAsync()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var areas = await connection.QueryAsync<AreaEntity>(AreaSql);
            foreach (var area in areas)
            {
                var match = _map.FirstOrDefault(a => a.OriginalAreaType == area.AreaType);
                if (match != null)
                {
                    area.AreaType = match.NewAreaType;
                    area.HierarchyType = match.HierarchyType;
                }
            }
            return areas;
        }
    }

    class GeographyMap
    {
        public string OriginalAreaType { get; set; }

        public string NewAreaType { get; set; }

        public int Level { get; set; }

        public string HierarchyType{get;set; }
    }

    public class ParentChildAreaCode
    {
        public string ParentAreaCode { get; set; }
        public string ChildAreaCode { get; set; }
    }
}
