import { GeoJSON } from 'highcharts';
import { union } from '@turf/union';
import { featureCollection } from '@turf/helpers';

export function getMapGroup(
  mapData: GeoJSON,
  areaCodes: string[],
  joinKey: string
): GeoJSON {
  const regionGeometry = mapData.features
    .filter((feature) => areaCodes.includes(feature.properties[joinKey]))
    .reduce(
      (combined, feature) => {
        const geometry = feature.geometry;
        if (geometry.type === 'Polygon') {
          combined.coordinates.push(geometry.coordinates);
        } else if (geometry.type === 'MultiPolygon') {
          combined.coordinates.push(...geometry.coordinates);
        }
        return combined;
      },
      {
        type: 'MultiPolygon',
        coordinates: [],
      }
    );

  const groupMap: GeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: regionGeometry,
      },
    ],
  };

  return groupMap;
}
