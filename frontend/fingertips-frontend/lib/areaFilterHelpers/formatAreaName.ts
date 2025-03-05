import { gpsAreaType } from './areaType';

export function formatAreaName(
  areaCode: string,
  areaName: string,
  areaTypeKey: string
): string {
  return areaTypeKey.toLowerCase() === gpsAreaType.key
    ? `${areaCode} - ${areaName}`
    : areaName;
}
