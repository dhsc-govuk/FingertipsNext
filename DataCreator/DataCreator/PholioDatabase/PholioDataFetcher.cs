using System.Globalization;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace DataCreator.PholioDatabase
{
    public class PholioDataFetcher(IConfiguration config)
    {
        private readonly IConfiguration _config = config;
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
	[dbo].[IndicatorMetadataTextValues] metadata ON indicator.IndicatorID=metadata.IndicatorID AND metadata.[1_Name] IS NOT NULL
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
	comparatormethods.ComparatorMethodID,
    comparatormethods.ShortName
FROM 
	[dbo].[IndicatorMetadata] indicator
JOIN
	[dbo].[grouping] gr ON indicator.IndicatorID = gr.IndicatorID
JOIN
	[dbo].[L_ComparatorMethods] comparatormethods ON gr.ComparatorMethodID=comparatormethods.ComparatorMethodID
WHERE comparatormethods.ComparatorMethodID !=6
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

        public async Task<IEnumerable<AreaEntity>> FetchAreasAsync()
        {   
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var areas = (await connection.QueryAsync<AreaEntity>($"{AreaSql}{AreaTypes}")).ToList();
            SetAreaHierarchyAndCleanNames(areas);
            await AddChildAreas(areas, connection);

            return areas;
        }

        private static async Task AddChildAreas(List<AreaEntity> areas, SqlConnection connection)
        {
            var parentChildMap = (await connection.QueryAsync<ParentChildAreaCode>(AreaChildSql)).ToList();
            var parentGroup = parentChildMap.GroupBy(x => x.ParentAreaCode).ToList();
            //now create the child and parents
            var areasDict = areas.ToDictionary(area => area.AreaCode);
            foreach (var area in areas)
            {
                //get the children of the area (if any)
                area.ChildAreas = CreateChildAreas(area, parentGroup, areasDict);
            }
        }

        /// <summary>
        /// Change the area type names to GDS compliant names
        /// </summary>
        /// <param name="areas"></param>
        private static void SetAreaHierarchyAndCleanNames(List<AreaEntity> areas)
        {
            List<AreaMap> typeNameMap=
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
                    Level=1
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
            var cultInfo =  new CultureInfo("en-GB", false).TextInfo;
            const string STATISTICAL = "(statistical)";
            const string CA = "CA-";

            foreach (var area in areas)
            {
                //change the area type to a standard name and set the hierarchy type and level
                var typeNameMatch = typeNameMap.FirstOrDefault(a => a.OriginalAreaType == area.AreaType);
                if (typeNameMatch != null)
                {
                    area.AreaType = typeNameMatch.NewAreaType;
                    area.HierarchyType = typeNameMatch.HierarchyType;
                    area.Level = typeNameMatch.Level;
                }

                area.AreaName=area.AreaName.Trim();
                //ticket DHSCFT-379, some area names should be changed

                //remove (statistical) that applies to admin regions
                if(area.AreaName.EndsWith(STATISTICAL))
                    area.AreaName=area.AreaName.Replace(STATISTICAL, string.Empty).Trim();
                //capitalise word region for NHS & admin regions
                if (area.AreaName.EndsWith("region"))
                    area.AreaName= cultInfo.ToTitleCase(area.AreaName);
                //for combined authorities remove the prefix CA- and add the suffix Combined Authority
                if (area.AreaName.StartsWith(CA))
                    area.AreaName=$"{area.AreaName.Replace(CA, string.Empty).Trim()} Combined Authority";
            }
        }


        private static List<AreaRelation> CreateChildAreas(AreaEntity area, IEnumerable<IGrouping<string,ParentChildAreaCode>> parentGroup, Dictionary<string, AreaEntity> areas)
        {
            var group = parentGroup.FirstOrDefault(x => x.Key == area.AreaCode);
            if (group == null)
                return [];
            var allChildren=group
                    .Select(child => new AreaRelation { AreaCode = child.ChildAreaCode })
                    .ToList();
            //work out the direct children
            foreach (var child in allChildren)
            {
                var present = areas.TryGetValue(child.AreaCode, out AreaEntity value);

                if (present)
                    child.IsDirect = area.Level == value.Level - 1 && area.HierarchyType == value.HierarchyType;
            }
            if (area.AreaCode == "E92000001") //England
                allChildren = areas.Values.Where(a => a.Level == 1).Select(a => new AreaRelation { AreaCode = a.AreaCode, IsDirect = true }).ToList();

            return allChildren.Where(x => x.IsDirect).ToList();
        }
        

        /// <summary>
        /// Get the indicators, adding in the Trend polarity as well as benchmarking details
        /// </summary>
        /// <returns></returns>
        public async Task<List<IndicatorEntity>> FetchIndicatorsAsync()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));

            var indicators = (await connection.QueryAsync<IndicatorEntity>(IndicatorSql)).ToList();
            indicators=indicators.Where(indicator=>!indicator.IndicatorName.Contains("CIA")).ToList();
            await AddPolarityToIndicators(indicators, connection);
            await AddBenchmarkComparisonAndUseProportionsForTrendToIndicators(indicators, connection);

            return indicators;
        }

        /// <summary>
        /// Get the age date
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<AgeEntity>> FetchAgeDataAsync()
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));
            return (await connection.QueryAsync<AgeEntity>(AgeSql)).ToList();
        }


        private async Task AddPolarityToIndicators(List<IndicatorEntity> indicators, SqlConnection connection)
        {
            var areaPolarities = await connection.QueryAsync<IndicatorPolarity>(IndicatorPolaritySql);
            
            foreach (var indicator in indicators)
            {
                var match  = areaPolarities.FirstOrDefault(ai => ai.IndicatorId == indicator.IndicatorID);
                if(match != null)
                {
                    var split=match.Polarity.Trim().Split(" - ");
                    indicator.Polarity = split[0] == "RAG" ? split[1] : "Not applicable";
                }
                else
                    indicator.Polarity = "Not applicable";
            }
        }

        private async Task AddBenchmarkComparisonAndUseProportionsForTrendToIndicators(List<IndicatorEntity> indicators, SqlConnection connection)
        {
            const int NinetyFiveAndNinetyNinePoint8= 17;
            const int NinetyNinePoint8 = 18;
            const int NinetyFive = 1;
            const int Proportions = 5;

            var benchmarks = await connection.QueryAsync<IndicatorBenchmark>(BenchmarkSql);
            var indicatorsWithMultiple = new List<int>();
            //for each indicator we want to set the benchmark comparison method and proportions for trend flag
            foreach (var indicator in indicators)
            {
                //if the indicator has a proportions method set the flag
                indicator.UseProportionsForTrend= benchmarks.Any(ab => ab.IndicatorId == indicator.IndicatorID && ab.ComparatorMethodID==5);
                
                //some indivcatrors have more than 1 benchmark methods - its shouldn't affect PoC data
                var results = benchmarks
                     .Where(ab => ab.IndicatorId == indicator.IndicatorID && ab.ComparatorMethodID!= Proportions)
                     .ToList();
                //there is a rule for PoC than any indicator that has 'CIs overlap reference value (95.0 & 99.8)' will be use either
                //CIs overlap reference value (95.0) or CIs overlap reference value (99.8)
                if (results.Any(x => x.ComparatorMethodID == NinetyFiveAndNinetyNinePoint8))
                {
                    if (results.Any(x => x.ComparatorMethodID == NinetyFive) || results.Any(x => x.ComparatorMethodID == NinetyNinePoint8))
                        results.RemoveAll(x => x.ComparatorMethodID == NinetyFiveAndNinetyNinePoint8);
                    else
                    {
                        var toChange = results.First(x => x.ComparatorMethodID == NinetyFiveAndNinetyNinePoint8);
                        toChange.ComparatorMethodID = NinetyNinePoint8;
                        toChange.ShortName = "CIs overlap reference value (99.8)";
                    }
                        
                }
                //a few still have 2 methods so use the first - doesn't affect PoC indicators
                if (results.Count > 0)
                    indicator.BenchmarkComparisonMethod = results.First().ShortName;
                else
                    indicator.BenchmarkComparisonMethod = "No comparison";
            }
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
        public string ShortName { get; set; }
    }

    public class ParentChildAreaCode
    {
        public string ParentAreaCode { get; set; }
        public string ChildAreaCode { get; set; }
    }
}
