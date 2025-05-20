import { gpsAreaType } from './areaType';

export function formatAreaName(
  areaCode: string,
  areaName: string,
  areaTypeKey: string,
  postcode?: string
): string {
  return areaTypeKey.toLowerCase() === gpsAreaType.key
    ? `${areaCode} - ${areaName} ${postcode ?? ''}`
    : areaName;
}
