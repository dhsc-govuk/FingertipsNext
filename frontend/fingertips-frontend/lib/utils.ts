export const getEnvironmentVariable = (
  name: string,
  throwOnError: boolean = true
): string | void => {
  return (
    process.env[name] ??
    (() => {
      if (throwOnError) {
        throw new Error(`Missing environment variable ${name}`);
      }
    })()
  );
};
