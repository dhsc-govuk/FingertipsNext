namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public enum BenchmarkComparisonMethod
{
    None,
    Rag,
    Quintiles,
    CIOverlappingReferenceValue95,
    CIOverlappingReferenceValue99
}