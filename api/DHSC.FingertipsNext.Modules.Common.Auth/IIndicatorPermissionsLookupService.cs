namespace DHSC.FingertipsNext.Modules.Common.Auth
{
    /// <summary>
    /// Service to lookup indicator permissions.
    /// Currently being made available via the userauth module.
    /// </summary>
    public interface IIndicatorPermissionsLookupService
    {
        /// <summary>
        /// Gets a list of indicator IDs mapped to by a list of role Ids.
        /// </summary>
        /// <param name="roleIds">List of role IDs</param>
        /// <returns>List of indicator IDs these roles provide permissions for.</returns>
        public Task<IEnumerable<int>> GetIndicatorsForRoles(IEnumerable<Guid> roleIds);
    }
}
