﻿using System.Globalization;
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
	areatypes.AreaType IN 
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
	yeartypes.YearType,
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
JOIN
	[dbo].[L_YearTypes] yeartypes ON indicator.YearTypeID=yeartypes.YearTypeID
WHERE
    indicator.IndicatorID IN @IndicatorIds
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

            var areas = (await connection.QueryAsync<AreaEntity>($"{AreaSql}")).ToList();
            SetAreaHierarchyAndCleanNames(areas);
            await AddChildAreas(areas, connection);
            CleanAreaCodes(areas);
            return areas;
        }

        private static void CleanAreaCodes(List<AreaEntity> areas)
        {
            foreach (var area in areas)
            {
                area.AreaCode = area.AreaCode.CleanAreaCode();
                foreach (var child in area.ChildAreas)
                {
                    child.AreaCode = child.AreaCode.CleanAreaCode();
                }
            }
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
            List<AreaMap> typeNameMap =
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
                },
                new() {
                    OriginalAreaType="LA new 2019",
                    NewAreaType=DISTRICT,
                    HierarchyType=Administrative,
                    Level=3
                },
                new() {
                    OriginalAreaType="LA unchanged",
                    NewAreaType=DISTRICT,
                    HierarchyType=Administrative,
                    Level=3
                },
                new()
                {
                    OriginalAreaType="UA new 2019",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                },
                new()
                {
                    OriginalAreaType="UA new 2020",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                },
                new()
                {
                    OriginalAreaType="UA new 2021",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                },
                new()
                {
                    OriginalAreaType="UA new 2023",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                },
                new()
                {
                    OriginalAreaType="UA unchanged",
                    NewAreaType=COUNTIESANDUA,
                    HierarchyType=Administrative,
                    Level=2
                },
                new()
                {
                    OriginalAreaType="NHS region",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS,
                    Level=1
                },
                new()
                {
                    OriginalAreaType="NHS regions - new due to ICB changes",
                    NewAreaType=NHSREGION,
                    HierarchyType=NHS,
                    Level=1
                },
                new()
                {
                    OriginalAreaType="PCNs (v. 26/04/24)",
                    NewAreaType="NHS Primary Care Networks",
                    HierarchyType=NHS,
                    Level=4
                },
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
            var cultInfo = new CultureInfo("en-GB", false).TextInfo;
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

                area.AreaName = area.AreaName.Trim();
                //ticket DHSCFT-379, some area names should be changed

                //remove (statistical) that applies to admin regions
                if (area.AreaName.EndsWith(STATISTICAL))
                    area.AreaName = area.AreaName.Replace(STATISTICAL, string.Empty).Trim();
                //capitalise word region for NHS & admin regions
                if (area.AreaName.EndsWith("region"))
                    area.AreaName = cultInfo.ToTitleCase(area.AreaName);
                //for combined authorities remove the prefix CA- and add the suffix Combined Authority
                if (area.AreaName.StartsWith(CA))
                    area.AreaName = $"{area.AreaName.Replace(CA, string.Empty).Trim()} Combined Authority";
            }
        }

        private static List<AreaRelation> CreateChildAreas(AreaEntity area, IEnumerable<IGrouping<string, ParentChildAreaCode>> parentGroup, Dictionary<string, AreaEntity> areas)
        {

            var group = parentGroup.FirstOrDefault(x => x.Key == area.AreaCode);
            if (group == null)
                return [];
            var allChildren = group
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
                allChildren = areas.Values
                    .Where(a => a.Level == 1)
                    .Select(a => new AreaRelation { AreaCode = a.AreaCode, IsDirect = true })
                    .ToList();

            return allChildren
                .Where(x => x.IsDirect)
                .ToList();
        }


        /// <summary>
        /// Get the indicators, adding in the Trend polarity as well as benchmarking details
        /// </summary>
        /// <returns></returns>
        public async Task<List<IndicatorEntity>> FetchIndicatorsAsync(List<SimpleIndicator> pocIndicators)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("PholioDatabase"));
            var indicators = (await connection.QueryAsync<IndicatorEntity>(IndicatorSql, new { IndicatorIds = pocIndicators.Select(x => x.IndicatorID) })).ToList();
            CleanFrequencies(indicators);
            MapYearTypesToPeriodTypes(indicators);
            return indicators;
        }

        /// <summary>
        /// Change Frequencies to GDS compliant names
        /// </summary>
        /// <parm name="indicators"/>
        private static void CleanFrequencies(List<IndicatorEntity> indicators)
        {
            const string annualFrequency = "annually";
            var frequencyMap = new Dictionary<string, string>()
            {
                {"Annual", annualFrequency},
                {"Annual.", annualFrequency},
                {
                    "Annual (for NHS Digital data release, COVER data collected for every quarter by UKHSA).",
                    annualFrequency
                },
                { "Annual. The source data is released in February or March, approximately 14 months after the end of the year in which the conceptions occurred. The indicator will usually be updated in Fingertips in May.", annualFrequency },
                { "The data will be updated annually", annualFrequency },
                { "The data will be updated annually.", annualFrequency },
                { "Annual measurements during academic year. Data published in the final quarter of the calendar year.", annualFrequency },
                { "Quarterly", "quarterly" }
            };
            foreach (var indicator in indicators)
            {
                var originalFrequency = indicator.Frequency;
                if (originalFrequency == null)
                {
                    indicator.Frequency = annualFrequency;
                }
                else if (frequencyMap.TryGetValue(originalFrequency, out var mappedValue))
                {
                    indicator.Frequency = mappedValue;
                }
                else
                {
                    throw new ArgumentOutOfRangeException(
                        indicator.Frequency, originalFrequency, "does not have a known mapping"
                        );
                }
            }
        }

        /// <summary>
        /// Change YearType to agreed options
        /// </summary>
        /// <parm name="indicators"/>
        private static void MapYearTypesToPeriodTypes(List<IndicatorEntity> indicators)
        {
            var periodTypeMap = new Dictionary<string, string>
            {
                {"November-November", "Yearly"},
                {"Financial multi year cumulative quarters","Financial multi-year"}
            };

            var allowedPeriodTypes = new HashSet<string>
            {
                "Calendar",
                "Financial",
                "Financial year end point",
                "Financial multi-year",
                "Academic"
            };

            foreach (var indicator in indicators)
            {
                if (periodTypeMap.TryGetValue(indicator.YearType, out var mappedValue))
                {
                    indicator.PeriodType = mappedValue;
                    continue;
                }

                if (!allowedPeriodTypes.Contains(indicator.YearType))
                {
                    throw new ArgumentOutOfRangeException(
                        indicator.YearType, indicator.YearType, "does not have a known mapping"
                    );
                }
                indicator.PeriodType = indicator.YearType;
            }
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
    }

    record AreaMap
    {
        public string OriginalAreaType { get; set; }

        public string NewAreaType { get; set; }

        public int Level { get; set; }

        public string HierarchyType { get; set; }
    }

    public record IndicatorArea
    {
        public int IndicatorId { get; set; }
        public string AreaCode { get; set; }
    }

    public record IndicatorPolarity
    {
        public int IndicatorId { get; set; }
        public string Polarity { get; set; }
    }

    public record IndicatorBenchmark
    {
        public int IndicatorId { get; set; }
        public int ComparatorMethodID { get; set; }
        public string ShortName { get; set; }
    }

    public record ParentChildAreaCode
    {
        public string ParentAreaCode { get; set; }
        public string ChildAreaCode { get; set; }
    }
}
