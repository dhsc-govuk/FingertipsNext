using Microsoft.Extensions.Logging;

namespace DHSC.FingertipsNext.Modules.Core.Service;

public static partial class LoggingExtensions
{
    [LoggerMessage(EventId = 0, Level = LogLevel.Error, Message = "Search Specific Log Example failed operation during: `{Context}`")]
    public static partial void LogExampleTwo(this ILogger logger, string context, Exception exception);
} 
