using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Diagnostics.Metrics;
using System.Reflection.Metadata;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => inequalities.Contains("sex") ? true : hm.SexDimension.HasValue == false)
            .Where(hm => inequalities.Contains("age") ? true : hm.AgeDimension.HasValue == false)
            // TODO: Will be expanded to allow the deprivation dimension to be retrieved based on a query param in DHSCFT-396
            .Where(hm => hm.DeprivationDimension.HasValue == false)
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.AgeDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Include(hm => hm.DeprivationDimension)
            .Select(x => new HealthMeasureModel()
            {
                Year = x.Year,
                Value = x.Value,
                Count = x.Count,
                LowerCi = x.LowerCi,
                UpperCi = x.UpperCi,
                AgeDimension = new AgeDimensionModel()
                {
                    Name = x.AgeDimension.Name,
                    HasValue = x.AgeDimension.HasValue,
                },
                SexDimension = new SexDimensionModel()
                {
                    Name = x.SexDimension.Name,
                    HasValue = x.SexDimension.HasValue
                },
                IndicatorDimension = new IndicatorDimensionModel()
                {
                    Name = x.IndicatorDimension.Name,
                },
                AreaDimension = new AreaDimensionModel()
                {
                    Code = x.AreaDimension.Code,
                    Name = x.AreaDimension.Name,
                },
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                },
                DeprivationDimension = new DeprivationDimensionModel()
                {
                    Name = x.DeprivationDimension.Name,
                    Type = x.DeprivationDimension.Type,
                    Sequence = x.DeprivationDimension.Sequence,
                    HasValue = x.DeprivationDimension.HasValue
                }
            })
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int IndicatorId, string[] AreaCodes, int[] Years)
    {
        var AreaTypeKey = "counties-and-unitary-authorities";

        // Convert the string arrays to table-valued parameters (TVPs) if needed
        var AreaCodesTable = new DataTable();
        AreaCodesTable.Columns.Add("AreaCode", typeof(string));
        foreach (var area in AreaCodes)
        {
            AreaCodesTable.Rows.Add(area);
        }
        var areasOfInterest = new SqlParameter("@AreasOfInterest", AreaCodesTable)
        {
            SqlDbType = SqlDbType.Structured,
            TypeName = "AreaCodeList"
        };

        var YearsTable = new DataTable();
        YearsTable.Columns.Add("YearNum", typeof(int));
        foreach (var item in Years)
        {
            YearsTable.Rows.Add(item);
        }
        var yearsOfInterest = new SqlParameter("@YearsOfInterest", YearsTable)
        {
            SqlDbType = SqlDbType.Structured,
            TypeName = "YearList"
        };

        var areaTypeOfInterest = new SqlParameter("@AreaTypeOfInterest", AreaTypeKey);
        var indicatorId = new SqlParameter("@IndicatorId", IndicatorId);

        var denormalisedHealthData = await _dbContext.DenormalisedHealthMeasure.FromSql
            ($"""
              EXEC dbo.GetIndicatorDetailsWithQuintileBenchmarkComparison @AreasOfInterest={areasOfInterest}, @AreaTypeOfInterest={areaTypeOfInterest}, @YearsOfInterest={yearsOfInterest}, @IndicatorId={indicatorId}
              """
            ).ToListAsync();

        var healthData = denormalisedHealthData.Select(healthData => healthData.Normalise()).ToList();

        return [.. denormalisedHealthData
            .Select(a => a.Normalise())
            .OrderBy(a => a.Year)];
    }

    private DataTable CreateDataTable(string[] values)
    {
        var table = new DataTable();
        table.Columns.Add("AreaCode", typeof(string));

        foreach (var value in values)
        {
            table.Rows.Add(value);
        }

        return table;
    }
}
