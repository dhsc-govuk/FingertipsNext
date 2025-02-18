namespace DHSC.FingertipsNext.Modules.Area.Repository;

public static class InternalHierarchyTypes
{
    // England appears once in the area types table but needs to be part of
    // multiple hierarchies (Admin and NHS). The special value 'All' is used
    // in the database, but is not exposed to consumers of the Api. 
    public const string All = "All";
}