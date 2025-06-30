using Microsoft.Extensions.Options;

namespace DHSC.FingertipsNext.Api.Services
{
    /// <summary>
    /// This is included as an MVP wraper for the OpenApiOptions configuration allowing openapi to startup 
    /// 
    /// </summary>
    /// <typeparam name="TOptions"></typeparam>
    internal class StaticOptions<TOptions> : IOptionsSnapshot<TOptions> where TOptions : class
    {
        private readonly TOptions _options;

        public StaticOptions(TOptions options)
        {
            _options = options;
        }

        public TOptions Value
        {
            get
            {
                return _options;
            }
        }

        public TOptions Get(string? name)
        {
            return _options;
        }
    }
}