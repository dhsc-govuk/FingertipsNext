type MapData = {
  mapJoinKey: string;
};
export function getMapData(areaType: string): MapData {
  return { mapJoinKey: mapJoinKeyEncoder[areaType] };
}

const mapJoinKeyEncoder: Record<string, string> = {
  'Regions Statistical': 'RGN23CD',
  'Counties & UAs': 'CTYUA23CD',
  'Districts & UAs': 'LAD24CD',
  'Combined Authorities': 'CAUTH23CD',
  'NHS region': 'NHSER24CD',
  'ICB': 'ICB23CD',
  'Sub ICB': 'SICBL23CD',
};
