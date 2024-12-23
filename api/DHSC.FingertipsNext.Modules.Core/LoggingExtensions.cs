namespace DHSC.FingertipsNext.Modules.Core;

public static partial class LoggingExtensions
{
    [LoggerMessage(1000, LogLevel.Error, "Log Example failed operation during: {Context}")]
    public static partial void LogExample(this ILogger logger, Exception exception, string context);
} 
