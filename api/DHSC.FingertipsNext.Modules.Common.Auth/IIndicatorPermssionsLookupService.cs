namespace DHSC.FingertipsNext.Modules.Common.Auth
{
    /// <summary>
    /// Provides scaffolding support to 
    /// </summary>
    public interface IIndicatorPermssionsLookupService
    {
        /// <summary>
        /// Gets a list of indicator IDs mapped to by a list of role Ids.
        /// </summary>
        /// <param name="roleIds">List of role IDs</param>
        /// <returns>List of indicator IDs these roles provide permissions for.</returns>
        public Task<IEnumerable<int>> GetIndicatorsForRoles(IEnumerable<Guid> roleIds);
    }
}
