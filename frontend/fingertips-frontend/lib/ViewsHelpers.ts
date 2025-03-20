export const maxIndicatorAPIRequestSize = 10;
export function chunkArray(arrayToChunk: string[], chunkSize: number) {
  const chunkedArray = [];
  for (let i = 0; i < arrayToChunk.length; i += chunkSize) {
    chunkedArray.push(arrayToChunk.slice(i, i + chunkSize));
  }
  return chunkedArray;
}
