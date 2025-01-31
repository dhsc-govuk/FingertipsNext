// TODO: test

const mapJoinKeyEncoder: Record<string, string> = {
  'Regions Statistical': 'RGN23CD',
  'Counties & UAs': 'CTYUA23CD',
  'Districts & UAs': '',
  // TODO: add CA map
  'NHS region': 'NHSER24CD',
  // 'ICB': '',
  // 'Sub ICB': '',
};

export function getMapJoinKey(areaType: string): string {
  return mapJoinKeyEncoder[areaType];
}
