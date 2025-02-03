// DW: see https://api.highcharts.com/highmaps/mapView.fitToGeometry

import { GeoJSON, GeoJSONFeature } from 'highcharts';

export function getMapZoom(
  mapData: GeoJSON,
  areaCodes: string[],
  joinKey: string
): GeoJSONFeature {
  const regionGeometry = mapData.features
    .filter((f) => areaCodes.includes(f.properties[joinKey]))
    .reduce(
      (combined, f) => {
        const geometry = f.geometry;
        if (geometry.type === 'Polygon') {
          combined.coordinates.push(geometry.coordinates);
        } else if (geometry.type === 'MultiPolygon') {
          combined.coordinates.push.apply(
            combined.coordinates,
            geometry.coordinates
          );
        }
        return combined;
      },
      {
        type: 'MultiPolygon',
        coordinates: [],
      }
    );

  return regionGeometry;
}
