using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using TrendAnalysisApp.Entity;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository(IConfiguration config)
{

    private readonly IConfiguration _config = config;

    private readonly string GetQuerySql = @$"SELECT TOP 5
        h.HealthMeasureKey,
        h.AgeKey,
        h.AreaKey,
        h.IndicatorKey,
        h.SexKey,
        h.TrendKey,
        h.Count,
        h.Value,
        h.LowerCI,
        h.UpperCI,
        h.Year
    FROM [dbo].[HealthMeasure] h
    WHERE h.AgeKey = @ageKey AND h.AreaKey = @areaKey AND 
    h.IndicatorKey = @indicatorKey AND h.SexKey = @sexKey
    ORDER BY h.year DESC;";

    /// <summary>
    /// Retrieves a health measure result set for a given set of dimensions.
    /// e.g. for an indicator with given dimensions for age group, area and sex.
    /// </summary>
    /// <param name="ageKey"></param>
    /// <param name="areaKey"></param>
    /// <param name="indicatorKey"></param>
    /// <param name="sexKey"></param>
    /// <returns>A health measure result set entity</returns>
    public HealthMeasureResultSet GetForUniqueDimension(
        int ageKey,
        int areaKey,
        int indicatorKey,
        int sexKey
    ) {
        using var connection = new SqlConnection(_config.GetConnectionString(Constants.Database.FingertipsDbName));

        var results = connection.Query<HealthMeasureModel>(GetQuerySql, new {
            ageKey,
            areaKey,
            indicatorKey,
            sexKey
        }).ToList();

        return HealthMeasureMapper.ToResultSetEntity(results);
    }
}
