import { gpsAreaType } from './areaType';

export function generateAreaDisplayString(
  areaCode: string,
  areaName: string,
  areaTypeKey: string,
  postcode?: string
): string {
  return areaTypeKey.toLowerCase() === gpsAreaType.key
    ? `${areaCode} - ${areaName}${postcode ? ' ' + postcode : ''}`
    : areaName + `${postcode ? ' ' + postcode : ''}`;
}
