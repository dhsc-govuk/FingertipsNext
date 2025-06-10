export function ConfidenceLimitsHeader({
  confidenceLimit,
}: Readonly<{ confidenceLimit?: number }>) {
  if (!confidenceLimit) return null;
  return (
    <>
      {confidenceLimit}%<br />
      confidence
      <br />
      limits
    </>
  );
}
