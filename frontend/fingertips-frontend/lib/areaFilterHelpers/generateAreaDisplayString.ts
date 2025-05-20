import { gpsAreaType } from './areaType';

export function generateAreaDisplayString(
  areaCode: string,
  areaName: string,
  areaTypeKey: string,
  postcode?: string
): string {
  return areaTypeKey.toLowerCase() === gpsAreaType.key
    ? `${areaCode} - ${areaName}${formatPostcode(postcode)}`
    : areaName + formatPostcode(postcode);
}

const formatPostcode = (postcode?: string) => (postcode ? ' ' + postcode : '');
