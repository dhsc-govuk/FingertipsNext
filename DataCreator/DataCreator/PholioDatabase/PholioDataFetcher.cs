using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataCreator.PholioDatabase
{
    public class PholioDataFetcher
    {
        private readonly IConfiguration _config;
        private readonly List<AreaMap> _map;
        private const string Region = "Regions";
        public const string Administrative = "Administrative";
        public const string NHS = "NHS";
        private const string COUNTIESANDUA = "Counties and Unitary Authorities";
        private const string COMBINEDAUTHORITIES = "Combined Authorities";
        private const string NHSREGION = "NHS Regions";
        private const string DISTRICT = "Districts and Unitary Authorities";
        private const string GP = "GPs";
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

        private readonly string AreaSql = @"
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
";
        private readonly string IndicatorSql = @"
SELECT 
	indicator.IndicatorID,
	valuetypes.ValueType,
	denomtypes.DenominatorType,
	cimethods.[Name] CIMethod,
	units.UnitLabel,
	units.UnitValue,
	metadata.[1_Name] IndicatorName,
	metadata.[3_Definition] IndicatorDefinition,
	metadata.[4_Rationale] Rationale,
	metadata.[6_DataSource] DataSource,
	metadata.[9_IndMethod] Method,
	metadata.[10_StandardPop] StandardPopulation,
	metadata.[11_CIMethod] CIMethodDetails,
	metadata.[12_CountSource] CountSource,
	metadata.[13_CountDefinition] CountDefinition,
	metadata.[14_DenomSource] DenominatorSource,
	metadata.[15_DenomDefinition] DenominatorDefinition,
	metadata.[16_DiscControl] DisclouseControl,
	metadata.[17_Caveats] Caveats,
	metadata.[18_Copyright] Copyright,
	metadata.[19_Reuse] Reuse,
	metadata.[22_Notes] Notes,
	metadata.[23_Frequency] Frequency,
	metadata.[24_Rounding] Rounding
FROM 
	[dbo].[IndicatorMetadata] indicator
JOIN
	[dbo].[L_ValueTypes] valuetypes ON indicator.ValueTypeID=valuetypes.ValueTypeID
JOIN
	[dbo].[L_DenominatorTypes] denomtypes ON indicator.DenominatorTypeID=denomtypes.DenominatorTypeID
JOIN
	[dbo].[L_CIMethods] cimethods ON indicator.CIMethodID = cimethods.CIMethodID
JOIN
	[dbo].[L_Units] units ON indicator.UnitID=units.UnitID
JOIN 
	[dbo].[IndicatorMetadataTextValues] metadata ON indicator.IndicatorID=metadata.IndicatorID
";
        
        private readonly string IndicatorPolaritySql = @"
SELECT distinct
	indicator.IndicatorID,
	Polarity.Polarity
FROM 
	[dbo].[IndicatorMetadata] indicator
JOIN
	[dbo].[grouping] gr ON indicator.IndicatorID = gr.IndicatorID
JOIN
	[dbo].[L_Polarity] polarity ON gr.PolarityID = polarity.PolarityID
";
  
        private readonly string BenchmarkSql = @"
SELECT distinct
	indicator.IndicatorID,
	comparatormethods.ComparatorMethodID
FROM 
	[dbo].[IndicatorMetadata] indicator
JOIN
	[dbo].[grouping] gr ON indicator.IndicatorID = gr.IndicatorID
JOIN
	[dbo].[L_ComparatorMethods] comparatormethods ON gr.ComparatorMethodID=comparatormethods.ComparatorMethodID
WHERE comparatormethods.ComparatorMethodID IN (1,5,15)
	Order By indicator.IndicatorID 
";


        private readonly string AgeSql = @"
SELECT
	AgeID,
	Age,
	MinYears,
	MaxYears
FROM
	[dbo].[L_Ages]
";

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
                    NewAreaType=COMBINEDAUTHORITIES,
                    HierarchyType=Administrative,
                    Level=2
                },
                new() {
                    OriginalAreaType="County unchanged",
                    NewAreaType=COUNTIESANDUA,
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
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2020",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2021",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA new 2023",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                }
                ,
                new()
                {
                    OriginalAreaType="UA unchanged",
                    NewAreaType=COUNTIESANDUA,
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
                    NewAreaType="NHS Primary Care Networks",
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
                    NewAreaType="NHS Sub Integrated Care Boards",
                    HierarchyType=NHS,
                    Level=3
                },
                new() {
                    OriginalAreaType="ICBs",
                    NewAreaType="NHS Integrated Care Boards",
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
                {
                    child.IsDirect = area.AreaType== COMBINEDAUTHORITIES
                        ? area.Level == value.Level && area.HierarchyType == value.HierarchyType
                        : area.Level == value.Level - 1 && area.HierarchyType == value.HierarchyType;
                }
                    
            }
            if(area.AreaCode== "E92000001") //England
                allChildren = areas.Values.Where(a=>a.Level==1).Select(a=>new AreaRelation { AreaCode = a.AreaCode, IsDirect = true }).ToList();
            
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
                    parent.IsDirect = area.Level == value.Level + 1 && area.HierarchyType == value.HierarchyType;
            }
            //some GPs are not in a PCN
            if(area.AreaType==GP && allParents.All(parent => !parent.IsDirect))
            {
                foreach (var parent in allParents)
                {
                    var present = areas.TryGetValue(parent.AreaCode, out AreaEntity value);
                    if (present)
                        parent.IsDirect = area.Level == value.Level + 2 && area.HierarchyType == value.HierarchyType;
                }
            }

            return allParents.Where(x => x.IsDirect).Distinct().ToList();
        }

        public async Task<IEnumerable<IndicatorEntity>> FetchIndicatorsAsync()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var indicators = (await connection.QueryAsync<IndicatorEntity>(IndicatorSql)).ToList();
            await AddPolarityToIndicators(indicators, connection);
            await AddBenchmarkComparisonAndUseProportionsForTrendToIndicators(indicators, connection);

            return indicators;
        }


        public async Task<IEnumerable<AgeEntity>> FetchAgeDataAsync()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));
            return (await connection.QueryAsync<AgeEntity>(AgeSql)).ToList();
        }


        private async Task AddPolarityToIndicators(List<IndicatorEntity> indicators, SqlConnection connection)
        {
            var areaPolarities = await connection.QueryAsync<IndicatorPolarity>(IndicatorPolaritySql);
            var indicatorsWithMultiplePolarites=new List<int>();
            foreach (var indicator in indicators)
            {
                var results = areaPolarities
                     .Where(ai => ai.IndicatorId == indicator.IndicatorID)
                     .ToList();
                if (results.Count() > 1)
                    indicatorsWithMultiplePolarites.Add(indicator.IndicatorID);
            }
            indicators.RemoveAll(i => indicatorsWithMultiplePolarites.Contains(i.IndicatorID));
            foreach (var indicator in indicators)
            {
                var match  = areaPolarities
                     .FirstOrDefault(ai => ai.IndicatorId == indicator.IndicatorID);
                indicator.Polarity = match != null ? match.Polarity : "Not applicable";
            }
        }

        private async Task AddBenchmarkComparisonAndUseProportionsForTrendToIndicators(List<IndicatorEntity> indicators, SqlConnection connection)
        {
            var areaBenchmarks = await connection.QueryAsync<IndicatorBenchmark>(BenchmarkSql);
            var indicatorsWithMultiple = new List<int>();
            foreach (var indicator in indicators)
            {
                indicator.UseProportionsForTrend= areaBenchmarks.Any(ab => ab.IndicatorId == indicator.IndicatorID && ab.ComparatorMethodID==5);
                var results = areaBenchmarks
                     .Where(ab => ab.IndicatorId == indicator.IndicatorID && (ab.ComparatorMethodID==1 || ab.ComparatorMethodID == 15))
                     .ToList();
                if (results.Count() > 1)
                    indicatorsWithMultiple.Add(indicator.IndicatorID);
                else if(results.Count > 0)
                    indicator.BenchmarkComparisonMethod = results.First().ComparatorMethodID == 1 ? "RAG" : "QUINTILES";
            }
            indicators.RemoveAll(i => indicatorsWithMultiple.Contains(i.IndicatorID));
            
        }
    }

    class AreaMap
    {
        public string OriginalAreaType { get; set; }

        public string NewAreaType { get; set; }

        public int Level { get; set; }

        public string HierarchyType{get;set; }
    }

    public class IndicatorArea
    {
        public int IndicatorId { get; set; }
        public string AreaCode { get; set; }
    }

    public class IndicatorPolarity
    {
        public int IndicatorId { get; set; }
        public string Polarity { get; set; }
    }

    public class IndicatorBenchmark
    {
        public int IndicatorId { get; set; }
        public int ComparatorMethodID { get; set; }
    }

    public class ParentChildAreaCode
    {
        public string ParentAreaCode { get; set; }
        public string ChildAreaCode { get; set; }
    }
}
