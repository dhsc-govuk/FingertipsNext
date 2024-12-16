namespace DHSC.FingertipsNext.Modules.Core;

public static partial class LoggingExtensions
{
    [LoggerMessage(0, LogLevel.Error, "Log Example failed operation during: {Context}")]
    public static partial void LogExample(this ILogger logger, Exception exception, string context, string bobbins);
} 