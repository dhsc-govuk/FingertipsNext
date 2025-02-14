using Dapper;
using Microsoft.Extensions.Configuration;
using MySqlConnector;

namespace DataCreator
{
    public class PostcodeFetcher(IConfiguration config)
    {
        private readonly IConfiguration _config = config;
        private const string SQL = @"
SELECT
    postcode AS Postcode,
    latitude AS Latitude,
    longitude AS Longitude
FROM
    open_postcode_geo
WHERE
    status = 'live' AND country='England'";

        public async Task<Dictionary<string,PostcodeLocation>> FetchAsync()
        {
            using var connection = new MySqlConnection(_config.GetConnectionString("PostcodeDatabase"));

            var rawPostcodes = await connection.QueryAsync<PostcodeLocation>(SQL);
            return rawPostcodes.ToDictionary(a => a.Postcode);
        }

    }
}
