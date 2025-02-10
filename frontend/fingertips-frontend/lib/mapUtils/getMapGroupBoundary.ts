import union from '@turf/union';
import { GeoJSON } from 'highcharts';
import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export function getMapGroupBoundary(
  mapData: GeoJSON,
  areaCodes: string[],
  joinKey: string
): GeoJSON {
  const groupAreas = mapData.features.filter((feature) =>
    areaCodes.includes(feature.properties[joinKey])
  );
  const groupFeatureCollection = {
    type: 'FeatureCollection',
    features: groupAreas as Feature<Polygon | MultiPolygon>[],
  } satisfies FeatureCollection<Polygon | MultiPolygon>;

  return {
    type: 'FeatureCollection',
    features: [union(groupFeatureCollection)!], // TODO: does this not null need handling?
  };
}
