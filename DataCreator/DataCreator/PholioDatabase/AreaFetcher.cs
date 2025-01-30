using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataCreator.PholioDatabase
{
    public class AreaFetcher
    {
        private readonly IConfiguration _config;
        private readonly List<GeographyMap> _map;
        private const string Region = "Region";
        private const string Administrative = "Administrative";
        private const string NHS = "NHS";
        private const string UA = "Unitary Authority";
        private const string NHSREGION = "NHS Region";
        private const string LA = "Local Authority";
        private const string AreaSql = @"
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
	areatypes.AreaType IN 
(
    'Combined authorities',
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
    'UA unchanged'
)
";
        public AreaFetcher(IConfiguration config)
        {
            _config = config;
            _map =
            [
                new()
                {
                    OriginalAreaType="Regions (statistical)",
                    NewAreaType=Region,
                    HierarchyType=Administrative
                },
                new() {
                    OriginalAreaType="Combined authorities",
                    NewAreaType="Combined Authority",
                    HierarchyType=Administrative
                },
                new() {
                    OriginalAreaType="County unchanged",
                    NewAreaType="County",
                    HierarchyType=Administrative
                }
                ,
                new() {
                    OriginalAreaType="LA new 2019",
                    NewAreaType=LA,
                    HierarchyType=Administrative
                }
                ,
                new() {
                    OriginalAreaType="LA unchanged",
                    NewAreaType=LA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2019",
                    NewAreaType=UA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2020",
                    NewAreaType=UA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2021",
                    NewAreaType=UA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2023",
                    NewAreaType=UA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="UA unchanged",
                    NewAreaType=UA,
                    HierarchyType=Administrative
                }
                ,
                new()
                {
                    OriginalAreaType="NHS region",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS
                }
                ,
                new()
                {
                    OriginalAreaType="NHS regions - new due to ICB changes",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS
                }
                ,
                new()
                {
                    OriginalAreaType="PCNs (v. 26/04/24)",
                    NewAreaType="PCN",
                    HierarchyType=NHS
                }
                ,
                new()
                {
                    OriginalAreaType="GPs",
                    NewAreaType="GP",
                    HierarchyType=NHS
                },
                new() {
                    OriginalAreaType="ICB sub-locations",
                    NewAreaType="ICB sub-location",
                    HierarchyType=NHS
                },
                new() {
                    OriginalAreaType="ICBs",
                    NewAreaType="ICB",
                    HierarchyType=NHS
                }
            ];
        }

        public async Task<IEnumerable<AreaEntity>> FetchAsync()
        {   
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var areas = await connection.QueryAsync<AreaEntity>(AreaSql);
            foreach(var area in areas)
            {
                var match = _map.FirstOrDefault(a => a.OriginalAreaType == area.AreaType);
                if(match != null)
                {
                    area.AreaType = match.NewAreaType;
                    area.HierarchyType=match.HierarchyType;
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
}
