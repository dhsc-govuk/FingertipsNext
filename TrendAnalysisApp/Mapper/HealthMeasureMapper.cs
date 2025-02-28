using TrendAnalysisApp.Entity;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Mapper;

/// <summary>
/// The Health Measure Mapper class.
/// </summary>
public class HealthMeasureMapper
{
    /// <summary>
    /// Maps a list of Health Measure DB objects into a HealthMeasureResultSet entity.
    /// </summary>
    /// <param name="models">A list of health measure DB objects</param>
    /// <returns>A mapped health measure result set</returns>
    public static HealthMeasureResultSet ToResultSetEntity(List<HealthMeasureModel> models) {
        var latestEntry = models.First();
        var dataPoints = ToDataPointEntities(models);

        return new HealthMeasureResultSet
        {
            AgeDimensionKey = latestEntry.AgeKey,
            AreaDimensionKey = latestEntry.AreaKey,
            IndicatorDimensionKey = latestEntry.IndicatorKey,
            SexDimensionKey = latestEntry.SexKey,
            MostRecentYearRecorded = latestEntry.Year,
            Data = dataPoints
        };
    }

    /// <summary>
    /// Maps a list of health measure DB objects to a list of data points.
    /// </summary>
    /// <param name="models">A list of health measure DB objects</param>
    /// <returns>A list of health measure data points</returns>
    public static List<HealthMeasureDataPoint> ToDataPointEntities(List<HealthMeasureModel> models) {
        List<HealthMeasureDataPoint> entities = [];

        foreach (var model in models) {
            entities.Add(
                new HealthMeasureDataPoint
                {
                    Count = model.Count,
                    Value =model.Value,
                    LowerCI = model.LowerCI,
                    UpperCI = model.UpperCI,
                    Year = model.Year
                }
            );
        }

        return entities;
    }
}
