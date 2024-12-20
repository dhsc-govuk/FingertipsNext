namespace DHSC.FingertipsNext.Modules.Core;

public static partial class LoggingExtensions
{
    [LoggerMessage(1000, LogLevel.Error, "Log Example failed operation during: {Context}")]
    public static partial void LogExample(this ILogger logger, Exception exception, string context);

    [LoggerMessage(1001, LogLevel.Warning,
        "Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!")]
    public static partial void LogTrustCert(this ILogger logger);
} 
